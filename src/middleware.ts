// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { JWTPayload } from 'jose';
import { verifyToken } from './lib/helpers/jwt';
import { cookies } from 'next/headers';

interface AuthenticatedRequest extends NextRequest {
	user?: JWTPayload; // Extend to hold the decoded token payload
}

export async function middleware(request: AuthenticatedRequest) {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;

	const payload = await verifyToken(token);

	if (!payload) {
		return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
	}

	console.log('middlwared', { payload });
	request.user = payload;
	const response = NextResponse.next();

	// response.user = payload;
	// // Set payload on the response
	response.headers.set('X-User', JSON.stringify(payload));
	return response; // Attach decoded payload to request
}
