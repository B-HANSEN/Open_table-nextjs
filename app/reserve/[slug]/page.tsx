import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Form from './components/Form';
import Header from './components/Header';

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string) => {
	const restaurant = await prisma.restaurant.findUnique({
		where: { slug },
	});
	if (!restaurant) {
		notFound();
	}
	return restaurant;
};

export default async function Reserve({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ date: string; partySize: string }>;
}) {
	const { slug } = await params;
	const { date, partySize } = await searchParams;
	const restaurant = await fetchRestaurantBySlug(slug);

	return (
		<div className='border-t h-screen'>
			<div className='py-9 w-3/5 m-auto'>
				<Header
					date={date}
					image={restaurant.main_image}
					name={restaurant.name}
					partySize={partySize}
				/>
				<Form date={date} partySize={partySize} slug={slug} />
			</div>
		</div>
	);
}
