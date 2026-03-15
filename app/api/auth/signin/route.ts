import { NextRequest } from 'next/server';
import validator from 'validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose'; // jose to create a manufactured JWT (avoid issues with SSR apps, avoid JWT here)
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	const errors: string[] = [];
	const { email, password } = await request.json();

	const validationSchema = [
		{
			valid: validator.isEmail(email),
			errorMessage: 'Email is invalid.',
		},
		{
			valid: validator.isLength(password, { min: 1 }),
			errorMessage: 'Password is invalid.',
		},
	];

	validationSchema.forEach((check) => {
		if (!check.valid) errors.push(check.errorMessage);
	});

	if (errors.length) {
		return Response.json({ errorMessage: errors[0] }, { status: 400 });
	}

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		return Response.json({ errorMessage: 'Email or password is invalid.' }, { status: 401 });
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return Response.json({ errorMessage: 'Email or password is invalid.' }, { status: 401 });
	}

	const alg = 'HS256';
	const secret = new TextEncoder().encode(process.env.JWT_SECRET);
	const token = await new jose.SignJWT({ email: user.email })
		.setProtectedHeader({ alg })
		.setExpirationTime('24h')
		.sign(secret);

	const cookieStore = await cookies();
	cookieStore.set('jwt', token, { maxAge: 60 * 6 * 24 }); // key: jwt, value: token and age of cookie, eg. 60sec, 6d, 24hrs

	return Response.json({
		firstName: user.first_name,
		lastName: user.last_name,
		email: user.email,
		phone: user.phone,
		city: user.city,
	});
}
