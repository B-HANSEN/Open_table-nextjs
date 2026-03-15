import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { findAvailableTables } from '../../../../../services/restaurant/findAvailableTables';

const prisma = new PrismaClient();

// Note: request with +1hr in the URL!!!
// example URL with queries:
// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-02-03&time=15:00:00.000Z&partySize=4

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params;
	const { searchParams } = request.nextUrl;
	const day = searchParams.get('day') as string;
	const time = searchParams.get('time') as string;
	const partySize = searchParams.get('partySize') as string;

	if (!day || !time || !partySize) {
		return Response.json({ errorMessage: 'Invalid data provided.' }, { status: 400 });
	}

	// get all tables and operating times in the [slug] restaurant:
	const restaurant = await prisma.restaurant.findUnique({
		where: { slug },
		select: { tables: true, open_time: true, close_time: true },
	});

	if (!restaurant) {
		return Response.json({ errorMessage: 'Invalid data provided.' }, { status: 400 });
	}

	const searchTimesWithTables = await findAvailableTables({ day, time, restaurant });

	if (!searchTimesWithTables) {
		return Response.json({ errorMessage: 'Invalid data provided.' }, { status: 400 });
	}

	// for each searchTime, add up table capacity:
	const availabilities = searchTimesWithTables
		.map((t) => {
			const sumSeats = t.tables.reduce((sum, table) => sum + table.seats, 0);
			return {
				time: t.time, // return searchTime itself
				available: sumSeats >= parseInt(partySize), // return available status
			};
		})
		.filter((availability) => {
			// filter by restaurant time window
			const timeIsAfterOpeningHour =
				new Date(`${day}T${availability.time}`) >=
				new Date(`${day}T${restaurant.open_time}`);
			const timeIsBeforeClosingHour =
				new Date(`${day}T${availability.time}`) <=
				new Date(`${day}T${restaurant.close_time}`);

			return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
		});

	return Response.json(availabilities);
}
