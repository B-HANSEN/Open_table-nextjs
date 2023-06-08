import React from 'react';
import Image from 'next/image'; // require next/image instead of HTML img tag, as Type 'StaticImageData' is not assignable to type 'string'.
import { Review } from '@prisma/client';

import fullStar from '../../public/icons/full-star.png';
import halfStar from '../../public/icons/half-star.png';
import emptyStar from '../../public/icons/empty-star.png';
import { calculateReviewRatingAverage } from '../../utils/calculateReviewRatingAverage';

const Stars = ({ rating, reviews }: { rating?: number; reviews: Review[] }) => {
	// in Rating component, we access review.rating directly
	// other components we get all reviews and have to calculate the average
	const reviewRating = rating || calculateReviewRatingAverage(reviews);

	const renderStars = () => {
		const stars = [];

		for (let i = 0; i < 5; i++) {
			const difference = parseFloat((reviewRating - i).toFixed(1));
			if (difference >= 1) stars.push(fullStar); // greater than 1
			else if (difference < 1 && difference > 0) {
				// between 0-1 excluding
				if (difference <= 0.2) stars.push(emptyStar);
				else if (difference > 0.2 && difference <= 0.6) stars.push(halfStar);
				else stars.push(fullStar);
			} else stars.push(emptyStar); // if 0
		}
		return stars.map((star, index) => (
			<Image src={star} alt='' className='w-4 h-4 mr-1' key={index} />
		));
	};
	return <div className='flex items-center'>{renderStars()}</div>;
};

export default Stars;
