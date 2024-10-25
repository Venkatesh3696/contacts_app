import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';
import syncDatabase from '@/lib/db/syncDatabase';
import User from '@/models/users';

export async function POST(request: Request) {
	await syncDatabase();
	const { email, password } = await request.json();
	console.log({ email, password });

	try {
		const existingUser = await User.findOne({
			where: {
				email,
			},
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: 'email alresdy exists! please login' },
				{ status: 400 },
			);
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ email, password: hashedPassword });
		console.log({ user });

		const token = jwt.sign({ user }, process.env.MY_JWT_SECRET!, {
			expiresIn: '1d',
		});

		//  const transporter = nodemailer.createTransport({
		// 		service: 'Gmail',
		// 		auth: {
		// 			user: process.env.EMAIL_USER!,
		// 			pass: process.env.EMAIL_PASS!,
		// 		},
		// 	});

		// 	const mailOptions = {
		// 		from: process.env.EMAIL_USER!,
		// 		to: email,
		// 		subject: 'Verify your email',
		// 		text: `Click the following link to verify your email: ${process.env.BASE_URL}/verify?token=${token}`,
		// 	};

		// 	await transporter.sendMail(mailOptions);

		return NextResponse.json(
			{
				message: 'Registration successful. Please verify your email.',
				token,
			},
			{ status: 201 },
		);
	} catch (error: any) {
		return NextResponse.json(
			{ message: 'error in creating user', error },
			{ status: 400 },
		);
	}
}
