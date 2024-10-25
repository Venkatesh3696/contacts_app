import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import jwt from 'jsonwebtoken';
import Contact from '@/models/contacts';
import syncDatabase from '@/lib/db/syncDatabase';

export async function POST(request: Request) {
	try {
		// syncDatabase();
		const userHeader = request.headers.get('X-User');
		const user = userHeader ? JSON.parse(userHeader) : null;
		const { userId } = user;

		const formData = await request.formData();
		const file = formData.get('csvFile');

		if (!file) {
			return NextResponse.json(
				{ error: 'No file uploaded' },
				{ status: 400 },
			);
		}

		const csvText = await file.text();

		const { data, errors } = Papa.parse(csvText, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (header) => header.trim().toLowerCase(),
		});

		console.log({ data });

		if (errors.length > 0) {
			return NextResponse.json(
				{ error: 'CSV parsing error', details: errors },
				{ status: 400 },
			);
		}

		const validatedRecords = data.map((row: any) => ({
			name: row.name?.trim(),
			email: row.email?.trim().toLowerCase(),
			phone: row.phone?.trim(),
			address: row.address?.trim(),
			timezone: row.timezone?.trim(),
		}));

		const insertedContacts = await Promise.all(
			validatedRecords.map(async (row) => {
				try {
					return await Contact.create({
						name: row.name,
						userId: userId,
						email: row.email,
						phone: row.phone,
						address: row.address,
						timezone: row.timezone,
					});
				} catch (error: any) {
					if (error.code === 11000) {
						throw new Error(`Duplicate email: ${row.email}`);
					}
					throw error;
				}
			}),
		);

		return NextResponse.json({
			message: `Successfully imported ${insertedContacts.length} contacts`,
			contacts: insertedContacts,
		});
	} catch (error: any) {
		console.error('Upload error:', error);
		return NextResponse.json(
			{ error: error.message || 'Error processing CSV file' },
			{ status: 500 },
		);
	}
}
