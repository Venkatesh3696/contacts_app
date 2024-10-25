// src/lib/jwt.ts
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

// Generate a JWT
export async function generateToken(payload: object): Promise<string> {
	const secret = new TextEncoder().encode(process.env.JWT_SECRET);
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime('1h')
		.sign(secret);
}

// Verify a JWT and return the payload
export async function verifyToken(token: string): Promise<JWTPayload | null> {
	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jwtVerify(token, secret);
		console.log({ payload });

		return payload;
	} catch (error) {
		return null; // Return null if verification fails
	}
}
