import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import { PrismaClient, Cuisine, Location, PRICE, Review } from '@prisma/client';

export interface RestaurantCardType {
	id: number;
	name: string;
	main_image: string;
	cuisine: Cuisine; // get type from Prisma
	location: Location;
	price: PRICE;
	slug: string;
	reviews: Review[];
}

const prisma = new PrismaClient(); // instance allows to reach out to database directly

const fetchRestaurants = async (): Promise<RestaurantCardType[]> => {
	const restaurants = await prisma.restaurant.findMany({
		// selectively pick from db
		select: {
			id: true,
			name: true,
			main_image: true,
			cuisine: true,
			slug: true,
			location: true,
			price: true,
			reviews: true,
		},
	});

	return restaurants;
};

export default async function Home() {
	const restaurants = await fetchRestaurants();

	return (
		<main>
			<Header />
			<div className='py-3 px-36 mt-10 flex flex-wrap justify-center'>
				{restaurants.map(restaurant => {
					return <RestaurantCard restaurant={restaurant} key={restaurant.id} />;
				})}
			</div>
		</main>
	);
}
