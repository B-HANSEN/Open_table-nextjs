import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken'; // jwt lib causes issues with SSR apps, use here for decoding payload only!

const prisma = new PrismaClient();

/** when testing in Postman, add Headers:
 * Authorization with value 'Bearer <paste actual token>' --- [0]: Bearer, [1]: Token */

export async function GET(request: NextRequest) {
	const bearerToken = request.headers.get('authorization');
	if (!bearerToken) {
		return Response.json({ errorMessage: 'Unauthorized request.' }, { status: 401 });
	}

	const token = bearerToken.split(' ')[1]; // [0] is Bearer, [1] is the token
	const payload = jwt.decode(token) as { email: string };

	if (!payload?.email) {
		return Response.json({ errorMessage: 'Unauthorized request.' }, { status: 401 });
	}

	const user = await prisma.user.findUnique({
		where: { email: payload.email },
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			city: true,
			phone: true,
		},
	});

	if (!user) {
		return Response.json({ errorMessage: 'User not found' }, { status: 401 });
	}

	return Response.json({
		id: user.id,
		firstName: user.first_name,
		lastName: user.last_name,
		phone: user.phone,
		city: user.city,
	});
}
