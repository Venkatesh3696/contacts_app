// import syncDatabase from '@/lib/db/syncDatabase';
import Contact from '@/models/contacts';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { name, email, phone, address, timezone } = await request.json();
		const userHeader = request.headers.get('X-User');
		const user = userHeader ? JSON.parse(userHeader) : null;
		const { userId } = user;

		const newContact = await Contact.create({
			userId,
			name,
			email,
			phone,
			address,
			timezone,
		});
		return NextResponse.json(
			{ newContact, message: 'contact created' },
			{ status: 201 },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'error creating contact', error },
			{ status: 400 },
		);
	}
}

export async function GET(request: Request) {
	try {
		const userHeader = request.headers.get('X-User');
		const user = userHeader ? JSON.parse(userHeader) : null;
		const { userId } = user;

		const contactsList = await Contact.findAll({
			where: {
				userId: userId,
				isDeleted: false,
			},
		});

		return NextResponse.json(contactsList, { status: 200 });
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{ message: 'error retriving contacts', error },
			{ status: 400 },
		);
	}
}
