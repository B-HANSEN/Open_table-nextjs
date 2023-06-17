import { PrismaClient, Table } from '@prisma/client';
import { NextApiResponse } from 'next';
import { times } from '../../data';

const prisma = new PrismaClient();

export const findAvailableTables = async ({
	time,
	day,
	res,
	restaurant,
}: {
	time: string;
	day: string;
	res: NextApiResponse;
	restaurant: {
		tables: Table[];
		open_time: string;
		close_time: string;
	};
}) => {
	// find searchTimes (surrounding slots) based on time (requested time) on query:
	const searchTimes = times.find(t => {
		return t.time === time;
	})?.searchTimes;

	if (!searchTimes) {
		return res.status(400).json({
			errorMessage: 'Invalid data provided.',
		});
	}

	// find bookings in database:
	const bookings = await prisma.booking.findMany({
		where: {
			booking_time: {
				gte: new Date(`${day}T${searchTimes[0]}`), // >= to first value in range
				lte: new Date(`${day}T${searchTimes[searchTimes.length - 4]}`), // <= to last value in range
			},
		},
		select: {
			number_of_people: true,
			booking_time: true,
			tables: true,
		},
	});

	const bookingsTableObject: { [key: string]: { [key: number]: true } } = {};
	// forEach to feed object in this format: { "2023-05-22T14:00:00.000Z": { 1: true, 2: true }, 'next booking... etc' }

	bookings.forEach(booking => {
		bookingsTableObject[booking.booking_time.toISOString()] = // booking_time is in ISO format, turn into a string
			booking.tables.reduce((obj, table) => {
				return {
					...obj,
					[table.table_id]: true,
				};
			}, {});
	});

	// extract tables:
	const tables = restaurant.tables;

	// create object from searchTimes that combines day/time from query with surrounding times (usually 5, actual plus 2 before and after)
	const searchTimesWithTables = searchTimes.map(searchTime => {
		return {
			date: new Date(`${day}T${searchTime}`),
			time: searchTime,
			tables,
		};
	});

	// for each searchTime (iterate over 5x t), filter out unavailable tables:
	searchTimesWithTables.forEach(t => {
		t.tables = t.tables.filter(table => {
			// is it a key within the obj?
			if (bookingsTableObject[t.date.toISOString()]) {
				// nested obj: within the value of this key, is there another key that matches the id provided here?
				if (bookingsTableObject[t.date.toISOString()][table.id]) return false; // filter it out
			}
			return true;
		});
	});

	return searchTimesWithTables;
};
