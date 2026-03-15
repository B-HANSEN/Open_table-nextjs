import Image from 'next/image';
import Link from 'next/link';
import { RestaurantCardType } from '../page';
import Price from './Price';
import Stars from './Stars';

interface Props {
	restaurant: RestaurantCardType;
}

export default function RestaurantCard({ restaurant }: Props) {
	return (
		<div className='w-64 m-3 overflow-hidden border rounded cursor-pointer h-72'>
			<Link href={`/restaurant/${restaurant.slug}`}>
				<div className='relative w-full h-36'>
					<Image
						alt={restaurant.name}
						className='object-cover'
						fill
						sizes='(max-width: 640px) calc(100vw - 1.5rem), 256px'
						src={restaurant.main_image}
					/>
				</div>
				<div className='p-1'>
					<h3 className='mb-2 text-2xl font-bold'>{restaurant.name}</h3>
					<div className='flex items-start'>
						<Stars reviews={restaurant.reviews} />
						<p className='ml-2'>
							{restaurant.reviews.length} review
							{restaurant.reviews.length === 1 ? '' : 's'}{' '}
						</p>
					</div>
					<div className='flex font-light capitalize text-reg'>
						<p className='mr-3'>{restaurant.cuisine.name}</p>
						<Price price={restaurant.price} />
						<p>{restaurant.location.name}</p>
					</div>
					<p className='mt-1 text-sm font-bold'>Booked 3 times today</p>
				</div>
			</Link>
		</div>
	);
}
