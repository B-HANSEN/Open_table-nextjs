import Link from 'next/link';

export default function RestaurantNavbar({ slug }: { slug: string }) {
	return (
		<nav className='flex text-reg border-b pb-2'>
			<Link className='mr-7' href={`/restaurant/${slug}`}>
				{' '}
				Overview{' '}
			</Link>
			<Link className='mr-7' href={`/restaurant/${slug}/menu`}>
				{' '}
				Menu{' '}
			</Link>
		</nav>
	);
}
