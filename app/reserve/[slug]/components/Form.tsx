'use client';

import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import useReservation from '../../../../hooks/useReservation';

export default function Form({
	slug,
	date,
	partySize,
}: {
	slug: string;
	date: string;
	partySize: string;
}) {
	const [input, setInput] = useState({
		bookerFirstName: '',
		bookerLastName: '',
		bookerPhone: '',
		bookerEmail: '',
		bookerOccasion: '',
		bookerRequest: '',
	});

	const [day, time] = date.split('T');
	const [disabled, setDisabled] = useState(true);
	const [didBook, setDidBook] = useState(false);
	const { loading, createReservation } = useReservation();

	useEffect(() => {
		if (
			input.bookerFirstName &&
			input.bookerLastName &&
			input.bookerEmail &&
			input.bookerPhone
		) {
			return setDisabled(false);
		}
		return setDisabled(true);
	}, [input]);

	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	};

	const handleClick = async () => {
		await createReservation({
			slug,
			partySize,
			time,
			day,
			bookerFirstName: input.bookerFirstName,
			bookerLastName: input.bookerLastName,
			bookerEmail: input.bookerEmail,
			bookerPhone: input.bookerPhone,
			bookerOccasion: input.bookerOccasion,
			bookerRequest: input.bookerRequest,
			setDidBook,
		});
	};

	return (
		<>
			{didBook ? (
				<h1 className='mt-10'>You have successfully made a reservation.</h1>
			) : (
				<>
					<div className='mt-10 flex flex-wrap justify-between w-[660px]'>
						<input
							type='text'
							className='border rounded p-3 w-80 mb-4'
							placeholder='First name'
							name='bookerFirstName'
							value={input.bookerFirstName}
							onChange={handleChangeInput}
						/>
						<input
							type='text'
							className='border rounded p-3 w-80 mb-4'
							placeholder='Last name'
							name='bookerLastName'
							value={input.bookerLastName}
							onChange={handleChangeInput}
						/>
						<input
							type='text'
							className='border rounded p-3 w-80 mb-4'
							placeholder='Phone number'
							name='bookerPhone'
							value={input.bookerPhone}
							onChange={handleChangeInput}
						/>
						<input
							type='text'
							className='border rounded p-3 w-80 mb-4'
							placeholder='Email'
							name='bookerEmail'
							value={input.bookerEmail}
							onChange={handleChangeInput}
						/>
						<input
							type='text'
							className='border rounded p-3 w-80 mb-4'
							placeholder='Occasion (optional)'
							name='bookerOccasion'
							value={input.bookerOccasion}
							onChange={handleChangeInput}
						/>
						<input
							type='text'
							className='border rounded p-3 w-80 mb-4'
							placeholder='Requests (optional)'
							name='bookerRequest'
							value={input.bookerRequest}
							onChange={handleChangeInput}
						/>
						<button
							disabled={disabled || loading}
							className='bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300'
							onClick={handleClick}>
							{loading ? (
								<CircularProgress color='inherit' />
							) : (
								'Complete reservation'
							)}
						</button>
						<p className='mt-4 text-sm'>
							By clicking “Complete reservation” you agree to the OpenTable
							Terms of Use and Privacy Policy. Standard text message rates may
							apply. You may opt out of receiving text messages at any time.
						</p>
					</div>
				</>
			)}
		</>
	);
}
