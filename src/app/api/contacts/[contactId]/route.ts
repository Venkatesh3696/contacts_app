import syncDatabase from '@/lib/db/syncDatabase';
import Contact from '@/models/contacts';
import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: any }) {
	try {
		const { contactId } = context.params;
		const userHeader = request.headers.get('X-User');
		const user = userHeader ? JSON.parse(userHeader) : null;
		const { userId } = user;

		const contact = await Contact.findOne({
			where: { id: contactId, userId: userId },
		});
		if (!contact) {
			return NextResponse.json(
				{
					message: `no contact with id ${contactId} found in your account`,
					contact,
				},
				{ status: 404 },
			);
		}
		return NextResponse.json(
			{
				messsage: 'even soft deleted i am assuming its better to send',
				contact,
			},
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'cannot find contact ', error },
			{ status: 404 },
		);
	}
}

export async function PUT(request: Request, conetxt: { params: any }) {
	try {
		const userHeader = request.headers.get('X-User');
		const user = userHeader ? JSON.parse(userHeader) : null;
		const { userId } = user;

		const { contactId } = conetxt.params;
		const toUpdateBody = await request.json();

		const updatedContact = await Contact.update(toUpdateBody, {
			where: {
				id: contactId,
				userId: userId,
			},
		});

		return NextResponse.json(
			{ updatedContact, message: 'contact updated' },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'cannot update contact', error },
			{ status: 404 },
		);
	}
}

export async function DELETE(request: Request, conetxt: { params: any }) {
	try {
		const { contactId } = conetxt.params;
		console.log({ contactId });

		const userHeader = request.headers.get('X-User');
		const user = userHeader ? JSON.parse(userHeader) : null;
		const { userId } = user;

		const updateBody = { isDeleted: true };
		const deletedContact = Contact.update(updateBody, {
			where: {
				id: contactId,
				userId: userId,
			},
		});

		return NextResponse.json(
			{ message: 'contact moced to bin (soft deleted) ', deletedContact },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'cannot update contact', error },
			{ status: 404 },
		);
	}
}
