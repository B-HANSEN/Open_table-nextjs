import { PRICE, PrismaClient } from '@prisma/client';
import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import SearchSidebar from './components/SearchSidebar';

const prisma = new PrismaClient();

interface SearchParams {
	city?: string;
	cuisine?: string;
	price?: PRICE;
}

const fetchRestaurantByCity = (searchParams: SearchParams) => {
	const where: any = {};

	if (searchParams.city) {
		const location = {
			name: {
				equals: searchParams.city.toLowerCase(),
			},
		};
		where.location = location;
	}

	if (searchParams.cuisine) {
		const cuisine = {
			name: {
				equals: searchParams.cuisine.toLowerCase(),
			},
		};
		where.cuisine = cuisine;
	}

	if (searchParams.price) {
		const price = {
			equals: searchParams.price,
		};
		where.price = price;
	}

	const select = {
		id: true,
		name: true,
		main_image: true,
		price: true,
		cuisine: true,
		location: true,
		slug: true,
	};

	return prisma.restaurant.findMany({ where, select });
};

const fetchLocations = () => prisma.location.findMany();

const fetchCuisines = () => prisma.cuisine.findMany();

const Search = async ({ searchParams }: { searchParams: SearchParams }) => {
	const restaurants = await fetchRestaurantByCity(searchParams);
	const locations = await fetchLocations();
	const cuisines = await fetchCuisines();

	return (
		<>
			<Header />
			<div className='flex py-4 m-auto w-2/3 justify-between items-start'>
				<SearchSidebar
					locations={locations}
					cuisines={cuisines}
					searchParams={searchParams}
				/>
				<div className='w-5/6'>
					{restaurants.length ? (
						restaurants.map(item => (
							<RestaurantCard key={item.id} item={item} />
						))
					) : (
						<div className='flex flex-wrap justify-between'>
							<p>This city does not have any restaurants.</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Search;
