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
		const errors: string[] = [];
		const { email, password } = req.body;

		const validationSchema = [
			{
				valid: validator.isEmail(email),
				errorMessage: 'Email is invalid.',
			},
			{
				valid: validator.isLength(password, {
					min: 1,
				}),
				errorMessage: 'Password is invalid.',
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

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res
				.status(401)
				.json({ errorMessage: 'Email or password is invalid.' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({
				errorMessage: 'Email or password is invalid.',
			});
		}

		const alg = 'HS256'; // set algorithm to use for the JWT
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);

		const token = await new jose.SignJWT({ email: user.email })
			.setProtectedHeader({ alg })
			.setExpirationTime('24h')
			.sign(secret);

		// set cookie for the client to save it into their browser, eg. in local/ session storage or cookie
		setCookie('jwt', token, { req, res, maxAge: 60 * 6 * 24 }); // key: jwt, value: token and age of cookie, eg. 60sec, 6d, 24hrs

		// send user info to client
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
