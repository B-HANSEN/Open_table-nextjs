'use client'; // to convert from server component to client component to utilise useRouter()-hook

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
	const router = useRouter();
	const [location, setLocation] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (location === '') return;
		router.push(`/search/?city=${location}`);
		setLocation('');
	};

	return (
		<form
			className='text-left text-lg py-3 m-auto flex justify-center'
			onSubmit={handleSubmit}>
			<label htmlFor='location-search' className='sr-only'>
				Search by state, city or town
			</label>
			<input
				id='location-search'
				className='rounded mr-3 p-3 w-[450px] bg-white text-gray-900 placeholder:text-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white'
				type='text'
				placeholder='State, city or town'
				value={location}
				onChange={e => setLocation(e.target.value)}
			/>
			<button
				type='submit'
				className='rounded bg-red-600 px-9 py-2 text-white'>
				Let's go
			</button>
		</form>
	);
}
