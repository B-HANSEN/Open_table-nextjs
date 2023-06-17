import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		const { slug, day, time, partySize } = req.query as {
			slug: string;
			day: string;
			time: string;
			partySize: string;
		};

		const {
			bookerEmail,
			bookerPhone,
			bookerFirstName,
			bookerLastName,
			bookerOccasion,
			bookerRequest,
		} = req.body;

		const restaurant = await prisma.restaurant.findUnique({
			where: { slug },
			select: { tables: true, open_time: true, close_time: true, id: true },
		});

		if (!restaurant) {
			return res.status(400).json({
				errorMessage: 'Restaurant not found.',
			});
		}

		if (
			new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
			new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
		) {
			return res.status(400).json({
				errorMessage: 'Restaurant is open not at that time.',
			});
		}

		const searchTimesWithTables = await findAvailableTables({
			day,
			time,
			res,
			restaurant,
		});

		if (!searchTimesWithTables) {
			return res.status(400).json({
				errorMessage: 'Invalid data provided.',
			});
		}

		const searchTimeWithTables = searchTimesWithTables.find(t => {
			return t.date.toISOString() === new Date(`${day}T${time}`).toISOString(); // unify date formats to avoid inconsistencies when comparing
		});

		if (!searchTimeWithTables) {
			return res.status(400).json({
				errorMessage: 'No availability, cannot book.',
			});
		}

		const tablesCount: {
			2: number[];
			4: number[];
		} = {
			2: [],
			4: [],
		};

		searchTimeWithTables.tables.forEach(table => {
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
					// if having a 4-seater
					tablesToBook.push(tablesCount[4][0]); // push first table
					tablesCount[4].shift(); // remove table from tables count
					seatsRemaining = seatsRemaining - 4; // remove from seats remaining
				} else {
					// otherwise, use 2-seater table
					tablesToBook.push(tablesCount[2][0]);
					tablesCount[2].shift();
					seatsRemaining = seatsRemaining - 2;
				}
			} else {
				// booking 2 people or less
				if (tablesCount[2].length) {
					tablesToBook.push(tablesCount[2][0]);
					tablesCount[2].shift();
					seatsRemaining = seatsRemaining - 2;
				} else {
					// if not having 2-seaters for 1-2 people, sit them at a 4-seater
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

		const bookingsOnTablesData = tablesToBook.map(table_id => {
			return {
				table_id,
				booking_id: booking.id,
			};
		});

		await prisma.bookingsOnTables.createMany({
			data: bookingsOnTablesData,
		});

		return res.json({ booking });
	}
}

// Note: request with +1hr in the URL!!!
// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-02-03&time=15:00:00.000Z&partySize=4
