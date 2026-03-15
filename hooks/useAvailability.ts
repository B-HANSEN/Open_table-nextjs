import { useState } from 'react';
import axios from 'axios';

export default function useAvailabilities() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState<
		{ time: string; available: boolean }[] | null
	>(null);

	const fetchAvailabilities = async ({
		slug,
		partySize,
		day,
		time,
	}: {
		slug: string;
		partySize: string;
		day: string;
		time: string;
	}) => {
		setLoading(true);

		try {
			const response = await axios.get(
				`/api/restaurant/${slug}/availability`,
				{
					params: { day, time, partySize },
				}
			);
			setData(response.data);
		} catch (error: any) {
			setError(error.response?.data?.errorMessage ?? 'Something went wrong.');
		} finally {
			setLoading(false);
		}
	};

	return { loading, data, error, fetchAvailabilities };
}
