import { Cuisine, Location, PRICE, Review } from '@prisma/client';
import Link from 'next/link';
import { calculateReviewRatingAverage } from '../../../utils/calculateReviewRatingAverage';
import Price from '../../components/Price';
import Stars from '../../components/Stars';

interface Restaurant {
	main_image: string;
	name: string;
	price: PRICE;
	cuisine: Cuisine;
	location: Location;
	id: number;
	slug: string;
	reviews: Review[];
}

const RestaurantCard = ({ item }: { item: Restaurant }) => {
	const renderRatingText = () => {
		const rating = calculateReviewRatingAverage(item.reviews);

		if (rating > 4) return 'Awesome';
		else if (rating <= 4 && rating > 3) return 'Good';
		else if (rating <= 3 && rating > 0) return 'Average';
		else return '';
	};

	return (
		<div className='border-b flex pb-5 ml-4'>
			<img src={item.main_image} alt='' className='w-44 h-32 rounded' />
			<div className='pl-5'>
				<h2 className='text-3xl'>{item.name}</h2>
				<div className='flex items-start'>
					<div className='flex mb-2'>
						<Stars reviews={item.reviews} />
					</div>
					<p className='ml-2 text-sm'>{renderRatingText()}</p>
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
};

export default RestaurantCard;
