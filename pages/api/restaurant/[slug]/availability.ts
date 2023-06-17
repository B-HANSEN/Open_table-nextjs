import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { times } from '../../../../data';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const { slug, day, time, partySize } = req.query as {
			slug: string;
			day: string;
			time: string;
			partySize: string;
		};

		if (!day || !time || !partySize) {
			return res.status(400).json({
				errorMessage: 'Invalid data provided.',
			});
		}

		// get all tables and operating times in the [slug] restaurant:
		const restaurant = await prisma.restaurant.findUnique({
			where: { slug },
			select: { tables: true, open_time: true, close_time: true },
		});

		if (!restaurant) {
			return res.status(400).json({
				errorMessage: 'Invalid data provided.',
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

		// for each searchTime, add up table capacity:
		const availabilities = searchTimesWithTables
			.map(t => {
				const sumSeats = t.tables.reduce((sum, table) => {
					return sum + table.seats;
				}, 0);

				return {
					time: t.time, // return searchTime itself
					available: sumSeats >= parseInt(partySize), // return available status
				};
			})
			.filter(availability => {
				// filter by restaurant time window
				const timeIsAfterOpeningHour =
					new Date(`${day}T${availability.time}`) >=
					new Date(`${day}T${restaurant.open_time}`);
				const timeIsBeforeClosingHour =
					new Date(`${day}T${availability.time}`) <=
					new Date(`${day}T${restaurant.close_time}`);

				return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
			});

		return res.json(availabilities); // by default, returns res.status(200), not required to specify
	}
}

// Note: request with +1hr in the URL!!!
// example URL with queries:
// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-02-03&time=15:00:00.000Z&partySize=4
