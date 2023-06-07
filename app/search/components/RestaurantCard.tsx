import { Cuisine, Location, PRICE } from '@prisma/client';
import Link from 'next/link';
import Price from '../../components/Price';

interface Restaurant {
	main_image: string;
	name: string;
	price: PRICE;
	cuisine: Cuisine;
	location: Location;
	id: number;
	slug: string;
}

export default function RestaurantCard({ item }: { item: Restaurant }) {
	return (
		<div className='border-b flex pb-5 ml-4'>
			<img src={item.main_image} alt='' className='w-44 h-32 rounded' />
			<div className='pl-5'>
				<h2 className='text-3xl'>{item.name}</h2>
				<div className='flex items-start'>
					<div className='flex mb-2'>*****</div>
					<p className='ml-2 text-sm'>Awesome</p>
				</div>
				<div className='mb-9'>
					<div className='font-light flex text-reg'>
						<Price price={item.price} />
						<p className='mr-4 capitalize'>{item.cuisine.name}</p>
						<p className='mr-4 capitalize'>{item.location.name}</p>
					</div>
				</div>
				<div className='text-red-600'>
					<Link href={`/restaurant/${item.slug}`}>View more information</Link>
				</div>
			</div>
		</div>
	);
}
