'use client';

import { Cuisine, Location, PRICE } from '@prisma/client';
import Link from 'next/link';

export default function SearchSidebar({
	locations,
	cuisines,
	searchParams,
}: {
	locations: Location[];
	cuisines: Cuisine[];
	searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) {
	const prices = [
		{
			price: PRICE.CHEAP,
			label: '$$',
			className: 'border w-full text-reg text-center font-light rounded-l p-2',
		},
		{
			price: PRICE.REGULAR,
			label: '$$$',
			className: 'border w-full text-reg text-center font-light p-2',
		},
		{
			price: PRICE.EXPENSIVE,
			label: '$$$$',
			className: 'border w-full text-reg text-center font-light rounded-r p-2',
		},
	];

	return (
		<div className='w-1/5'>
			<div className='flex flex-col pb-4 border-b'>
				<h1 className='mb-2'>Region</h1>
				{locations.map((el) => (
					<Link
						key={el.id}
						className='font-light capitalize text-reg'
						href={{
							pathname: '/search',
							query: {
								...searchParams, // use existing params
								city: el.name, // add city as param
							},
						}}
					>
						{el.name}
					</Link>
				))}
			</div>
			<div className='flex flex-col pb-4 mt-3 border-b'>
				<h1 className='mb-2'>Cuisine</h1>
				{cuisines.map((el) => (
					<Link
						key={el.id}
						className='font-light capitalize text-reg'
						href={{
							pathname: '/search',
							query: {
								...searchParams,
								cuisine: el.name,
							},
						}}
					>
						{el.name}
					</Link>
				))}
			</div>
			<div className='pb-4 mt-3'>
				<h1 className='mb-2'>Price</h1>
				<div className='flex'>
					{prices.map(({ price, label, className }, index) => (
						<Link
							key={index}
							className={className}
							href={{
								pathname: '/search',
								query: {
									...searchParams,
									price,
								},
							}}
						>
							{label}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
