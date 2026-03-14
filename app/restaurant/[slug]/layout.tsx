import Header from './components/Header';

export default async function RestaurantLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	return (
		<main>
			<Header name={slug} />
			<div className='flex m-auto w-2/3 justify-between items-start 0 -mt-11'>
				{children}
			</div>
		</main>
	);
}
