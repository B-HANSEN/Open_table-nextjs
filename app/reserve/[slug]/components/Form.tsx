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
							className='border rounded p-3 w-80 mb-4'
							name='bookerFirstName'
							onChange={handleChangeInput}
							placeholder='First name'
							type='text'
							value={input.bookerFirstName}
						/>
						<input
							className='border rounded p-3 w-80 mb-4'
							name='bookerLastName'
							onChange={handleChangeInput}
							placeholder='Last name'
							type='text'
							value={input.bookerLastName}
						/>
						<input
							className='border rounded p-3 w-80 mb-4'
							name='bookerPhone'
							onChange={handleChangeInput}
							placeholder='Phone number'
							type='text'
							value={input.bookerPhone}
						/>
						<input
							className='border rounded p-3 w-80 mb-4'
							name='bookerEmail'
							onChange={handleChangeInput}
							placeholder='Email'
							type='text'
							value={input.bookerEmail}
						/>
						<input
							className='border rounded p-3 w-80 mb-4'
							name='bookerOccasion'
							onChange={handleChangeInput}
							placeholder='Occasion (optional)'
							type='text'
							value={input.bookerOccasion}
						/>
						<input
							className='border rounded p-3 w-80 mb-4'
							name='bookerRequest'
							onChange={handleChangeInput}
							placeholder='Requests (optional)'
							type='text'
							value={input.bookerRequest}
						/>
						<button
							className='bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300'
							disabled={disabled || loading}
							onClick={handleClick}
						>
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
