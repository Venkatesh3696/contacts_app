import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/users';

import { generateToken } from '@/lib/helpers/jwt';

type User = {
	id: number;
	password: string;
};

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json();

		const user = (await User.findOne({ where: { email } })) as User | null;

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

		const payload = { userId: user.id.toString() };
		const token = await generateToken(payload);

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
	} catch (error: unknown) {
		return NextResponse.json(
			{ message: 'error logging in!', error },
			{ status: 500 },
		);
	}
}
