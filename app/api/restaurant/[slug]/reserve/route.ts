import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { findAvailableTables } from '../../../../../services/restaurant/findAvailableTables';

const prisma = new PrismaClient();

// Note: request with +1hr in the URL!!!
// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-02-03&time=15:00:00.000Z&partySize=4

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params;
	const { searchParams } = request.nextUrl;
	const day = searchParams.get('day') as string;
	const time = searchParams.get('time') as string;
	const partySize = searchParams.get('partySize') as string;

	const {
		bookerEmail,
		bookerPhone,
		bookerFirstName,
		bookerLastName,
		bookerOccasion,
		bookerRequest,
	} = await request.json();

	const restaurant = await prisma.restaurant.findUnique({
		where: { slug },
		select: { tables: true, open_time: true, close_time: true, id: true },
	});

	if (!restaurant) {
		return Response.json({ errorMessage: 'Restaurant not found.' }, { status: 400 });
	}

	if (
		new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
		new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
	) {
		return Response.json(
			{ errorMessage: 'Restaurant is open not at that time.' },
			{ status: 400 }
		);
	}

	const searchTimesWithTables = await findAvailableTables({ day, time, restaurant });

	if (!searchTimesWithTables) {
		return Response.json({ errorMessage: 'Invalid data provided.' }, { status: 400 });
	}

	const searchTimeWithTables = searchTimesWithTables.find((t) => {
		return t.date.toISOString() === new Date(`${day}T${time}`).toISOString(); // unify date formats to avoid inconsistencies when comparing
	});

	if (!searchTimeWithTables) {
		return Response.json({ errorMessage: 'No availability, cannot book.' }, { status: 400 });
	}

	const tablesCount: { 2: number[]; 4: number[] } = { 2: [], 4: [] };

	searchTimeWithTables.tables.forEach((table) => {
		if (table.seats === 2) {
			tablesCount[2].push(table.id);
		} else {
			tablesCount[4].push(table.id);
		}
	}); // tablesCount: { "2": [3], "4": [1, 2] } --- table id 3 has 2 seats

	const tablesToBook: number[] = [];
	let seatsRemaining = parseInt(partySize);

	while (seatsRemaining > 0) {
		if (seatsRemaining >= 3) {
			if (tablesCount[4].length) {
				tablesToBook.push(tablesCount[4][0]);
				tablesCount[4].shift();
				seatsRemaining = seatsRemaining - 4;
			} else {
				tablesToBook.push(tablesCount[2][0]);
				tablesCount[2].shift();
				seatsRemaining = seatsRemaining - 2;
			}
		} else {
			if (tablesCount[2].length) {
				tablesToBook.push(tablesCount[2][0]);
				tablesCount[2].shift();
				seatsRemaining = seatsRemaining - 2;
			} else {
				tablesToBook.push(tablesCount[4][0]);
				tablesCount[4].shift();
				seatsRemaining = seatsRemaining - 4;
			}
		}
	}

	const booking = await prisma.booking.create({
		data: {
			number_of_people: parseInt(partySize),
			booking_time: new Date(`${day}T${time}`),
			booker_email: bookerEmail,
			booker_phone: bookerPhone,
			booker_first_name: bookerFirstName,
			booker_last_name: bookerLastName,
			booker_occasion: bookerOccasion,
			booker_request: bookerRequest,
			restaurant_id: restaurant.id,
		},
	});

	const bookingsOnTablesData = tablesToBook.map((table_id) => ({
		table_id,
		booking_id: booking.id,
	}));

	await prisma.bookingsOnTables.createMany({ data: bookingsOnTablesData });

	return Response.json({ booking });
}
