import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose'; // jose to create a manufactured JWT (avoid issues with SSR apps, avoid JWT here)
import { setCookie } from 'cookies-next';

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		const { firstName, lastName, email, phone, city, password } = req.body;
		const errors: string[] = [];

		const validationSchema = [
			{
				valid: validator.isLength(firstName, {
					min: 1,
					max: 20,
				}),
				errorMessage: 'First name is invalid',
			},
			{
				valid: validator.isLength(lastName, {
					min: 1,
					max: 20,
				}),
				errorMessage: 'Last name is invalid',
			},
			{
				valid: validator.isEmail(email),
				errorMessage: 'Email is invalid',
			},
			{
				valid: validator.isMobilePhone(phone),
				errorMessage: 'Phone number is invalid',
			},
			{
				valid: validator.isLength(city, {
					min: 1,
				}),
				errorMessage: 'City is invalid',
			},
			{
				valid: validator.isStrongPassword(password),
				errorMessage: 'Password is not strong enough',
			},
		];

		validationSchema.forEach(check => {
			if (!check.valid) {
				errors.push(check.errorMessage);
			}
		});

		if (errors.length) {
			return res.status(400).json({ errorMessage: errors[0] });
		}

		const hashedPassword = await bcrypt.hash(password, 10); // add 10 characters (the salt) to the right, then hash the password

		const userWithEmail = await prisma.user.findUnique({ where: { email } }); // check if user exists in the db already
		if (userWithEmail) {
			return res
				.status(400)
				.json({ errorMessage: 'Email is associated with another account.' });
		}

		const user = await prisma.user.create({
			data: {
				first_name: firstName,
				last_name: lastName,
				password: hashedPassword,
				city,
				phone,
				email,
			},
		});

		const alg = 'HS256'; // set algorithm to use for the JWT
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);

		const token = await new jose.SignJWT({ email: user.email })
			.setProtectedHeader({ alg })
			.setExpirationTime('24h')
			.sign(secret);

		// set cookie for the client to save it into their browser, eg. in local/ session storage or cookie
		setCookie('jwt', token, { req, res, maxAge: 60 * 6 * 24 }); // key: jwt, value: token and age of cookie, eg. 60sec, 6d, 24hrs

		return res.status(200).json({
			firstName: user.first_name,
			lastName: user.last_name,
			email: user.email,
			phone: user.phone,
			city: user.city,
		});
	}

	return res.status(404).json('Unknown endpoint');
}
