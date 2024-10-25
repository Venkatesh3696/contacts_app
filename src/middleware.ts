import { NextRequest, NextResponse } from 'next/server';
import { JWTPayload } from 'jose';
import { verifyToken } from './lib/helpers/jwt';
import { cookies } from 'next/headers';
import { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends NextRequest {
	user?: JWTPayload;
}

export async function middleware(request: AuthenticatedRequest) {
	try {
		const cookieStore = cookies();
		const tokenCookie = cookieStore.get('token');

		if (!tokenCookie?.value) {
			return NextResponse.json(
				{ error: 'No authentication token' },
				{ status: 401 },
			);
		}

		const payload = (await verifyToken(tokenCookie.value)) as JwtPayload;

		if (!payload) {
			return NextResponse.json(
				{ error: 'Invalid token' },
				{ status: 401 },
			);
		}

		console.log('middleware', { payload });
		request.user = payload;

		const response = NextResponse.next();
		response.headers.set('X-User', JSON.stringify(payload));

		return response;
	} catch (error) {
		console.error('Middleware error:', error);
		return NextResponse.json(
			{ error: 'Authentication failed' },
			{ status: 401 },
		);
	}
}

// Optionally, specify which routes should use the middleware
export const config = {
	matcher: [
		// Add your protected routes here
		'/api/:path*',
		// Exclude auth routes if needed
		'/((?!api/auth).*)',
	],
};
