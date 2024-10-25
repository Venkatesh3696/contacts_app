import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/users';
import syncDatabase from '@/lib/db/syncDatabase';
import { generateToken } from '@/lib/helpers/jwt';

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json();
		await syncDatabase();

		const user = await User.findOne({ email });

		if (!user) {
			return new Response('User not found', { status: 404 });
		}

		const isCredentialsValid = bcrypt.compare(password, user.password);

		if (!isCredentialsValid) {
			return new Response('Invalid credentials', { status: 401 });
		}

		const response = NextResponse.json(
			{ message: 'Login successful' },
			{ status: 200 },
		);

		const payload = { userId: user.id };
		const token = await generateToken(payload);
		console.log({ token, message: 'in loin .js' });

		response.cookies.set({
			name: 'token',
			value: token,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60,
			path: '/',
		});

		return response;
	} catch (error: any) {
		return NextResponse.json(
			{ message: 'error logging in!', error },
			{ status: 500 },
		);
	}
}