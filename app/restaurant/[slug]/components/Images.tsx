import Image from 'next/image';

export default function Images({ images }: { images: string[] }) {
	return (
		<div>
			<h1 className='font-bold text-3xl mt-10 mb-7 border-b pb-5'>
				{images.length} photo{images.length > 1 ? 's' : ''}
			</h1>
			<div className='flex flex-wrap'>
				{images.map((image, index) => (
					<div className='relative w-56 h-44 mr-1 mb-1' key={index}>
					<Image src={image} alt='' fill sizes="(max-width: 640px) calc(50vw - 8px), (max-width: 1024px) calc(33vw - 8px), 224px" className='object-cover' />
				</div>
				))}
			</div>
		</div>
	);
}
