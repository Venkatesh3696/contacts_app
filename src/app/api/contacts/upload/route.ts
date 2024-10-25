import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import Contact from '@/models/contacts';

interface CSVRow {
	name: string;
	email: string;
	phone: string;
	address: string;
	timezone: string;
}

export async function POST(request: Request) {
	try {
		const userHeader = request.headers.get('X-User');
		const user = userHeader ? JSON.parse(userHeader) : null;
		const { userId } = user;

		const formData: FormData = await request.formData();
		const file: FormDataEntryValue | null = formData.get('csvFile');

		if (!file || !(file instanceof File)) {
			return NextResponse.json(
				{ error: 'No file uploaded' },
				{ status: 400 },
			);
		}

		const csvText = await file.text();

		const { data, errors } = Papa.parse<CSVRow>(csvText, {
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

		interface MyDataType {
			name: string;
			email: string;
			phone: string;
			address: string;
			timezone: string;
		}

		const validatedRecords = (
			row: unknown,
		): {
			name: string;
			email: string;
			phone: string;
			address: string;
			timezone: string;
		} => {
			const typedRow = row as MyDataType;

			return {
				name: typedRow.name,
				email: typedRow.email,
				phone: typedRow.phone,
				address: typedRow.address,
				timezone: typedRow.timezone,
			};
		};

		const insertedContacts = await Promise.all(
			validatedRecords.map(async (row: CSVRow) => {
				try {
					return await Contact.create({
						name: row.name,
						userId: userId,
						email: row.email,
						phone: row.phone,
						address: row.address,
						timezone: row.timezone,
					});
				} catch (error: unknown) {
					if (error instanceof Error) {
						console.error('Error occurred:', error.message);
					} else {
						console.error('Unexpected error:', error);
					}
				}
			}),
		);

		return NextResponse.json({
			message: `Successfully imported ${insertedContacts.length} contacts`,
			contacts: insertedContacts,
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error?.message || 'Error processing CSV file' },
				{ status: 500 },
			);
		} else {
			console.error('Upload error:', error);
		}
	}
}
