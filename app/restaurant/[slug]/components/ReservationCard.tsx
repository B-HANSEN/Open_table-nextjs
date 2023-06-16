'use client';

import { useState } from 'react';
import { partySize, times } from '../../../../data';
import DatePicker from 'react-datepicker';

export default function ReservationCard({
	openTime,
	closeTime,
}: {
	openTime: string;
	closeTime: string;
}) {
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

	const handleChangeDate = (date: Date | null) => {
		if (date) {
			return setSelectedDate(date);
		} else setSelectedDate(null);
	};

	const filterTimesByRestaurantOpenWindow = () => {
		// for each restaurant, dynamically return different options
		const timesWithinWindow: typeof times = [];
		let isWithinWindow = false;

		times.forEach(time => {
			if (!isWithinWindow && time.time === openTime) {
				isWithinWindow = true; // when reached start of the window
			}
			if (isWithinWindow) {
				timesWithinWindow.push(time); // push all times into array
			}
			if (time.time === closeTime) {
				isWithinWindow = false; // when reached end of the window
			}
		});

		return timesWithinWindow;
	};

	return (
		<div className='fixed w-[15%] bg-white rounded p-3 shadow'>
			<div className='text-center border-b pb-2 font-bold'>
				<h4 className='mr-7 text-lg'>Make a Reservation</h4>
			</div>
			<div className='my-3 flex flex-col'>
				<label htmlFor=''>Party size</label>
				<select name='' className='py-3 border-b font-light' id=''>
					{partySize.map(size => (
						<option value={size.value}>{size.label}</option>
					))}
				</select>
			</div>
			<div className='flex justify-between'>
				<div className='flex flex-col w-[48%]'>
					<label htmlFor=''>Date</label>
					<DatePicker
						selected={selectedDate}
						onChange={handleChangeDate}
						className='py-3 border-b font-light text-reg w-24' // import specific css into layout file to get proper format
						dateFormat='MMMM d'
						wrapperClassName='w-[48%]'
					/>
				</div>
				<div className='flex flex-col w-[48%]'>
					<label htmlFor=''>Time</label>
					<select name='' id='' className='py-3 border-b font-light'>
						{filterTimesByRestaurantOpenWindow().map(time => (
							<option value={time.time}>{time.displayTime}</option>
						))}
					</select>
				</div>
			</div>
			<div className='mt-5'>
				<button className='bg-red-600 rounded w-full px-4 text-white font-bold h-16'>
					Find a Time
				</button>
			</div>
		</div>
	);
}
