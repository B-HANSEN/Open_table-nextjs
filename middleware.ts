import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose'; // jose to create a manufactured JWT (avoid issues with SSR apps, avoid JWT here)

export async function middleware(req: NextRequest, res: NextResponse) {
	const bearerToken = req.headers.get('authorization') as string; // extract token from header
	if (!bearerToken) {
		return new NextResponse(
			JSON.stringify({ errorMessage: 'Unauthorized request (no header).' }),
			{ status: 401 }
		);
	}

	const token = bearerToken.split(' ')[1]; // [0] is Bearer, [1] is the token
	if (!token) {
		return new NextResponse(
			JSON.stringify({ errorMessage: 'Unauthorized request (no token).' }),
			{ status: 401 }
		);
	}

	const secret = new TextEncoder().encode(process.env.JWT_SECRET);

	try {
		await jose.jwtVerify(token, secret); // verify token
	} catch (error) {
		return new NextResponse(
			JSON.stringify({ errorMessage: 'Unauthorized request (invalid token).' }),
			{ status: 401 }
		);
	}
}

export const config = {
	matcher: ['/api/auth/me'], // specify all routes that should be caught by middleware
};
