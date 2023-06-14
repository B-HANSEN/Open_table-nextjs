import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken'; // jwt lib causes issues with SSR apps, use here for decoding payload only!

/** when testing in Postman, add Headers:
 * Authorization with value 'Bearer <paste actual token>' --- [0]: Bearer, [1]: Token */

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const bearerToken = req.headers['authorization'] as string; // extract token from header
	const token = bearerToken.split(' ')[1]; // [0] is Bearer, [1] is the token

	const payload = jwt.decode(token) as { email: JwtPayload }; // decode token to get payload
	if (!payload.email) {
		res.status(401).json({
			errorMessage: 'Unauthorized request.',
		});
	}

	const user = await prisma.user.findUnique({
		where: {
			email: payload.email.email, // unclear why payload is an object with key 'email' which contains the email value required
		},
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			city: true,
			phone: true,
		},
	});

	// return res.json({ result: payload }); // Postman shows email object
	return res.json({ user });
}
