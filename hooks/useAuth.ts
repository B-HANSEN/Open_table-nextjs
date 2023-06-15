import { useContext } from 'react';
import axios from 'axios';
import { AuthenticationContext } from '../app/context/AuthContext';
import { deleteCookie } from 'cookies-next';

const useAuth = () => {
	const { setAuthState } = useContext(AuthenticationContext);

	const signin = async (
		{
			email,
			password,
		}: {
			email: string;
			password: string;
		},
		handleClose: () => void
	) => {
		setAuthState({
			data: null,
			error: null,
			loading: true,
		});

		try {
			const response = await axios.post(
				'http://localhost:3000/api/auth/signin',
				{
					email,
					password,
				}
			);
			setAuthState({
				data: response.data,
				error: null,
				loading: false,
			});
			handleClose();
		} catch (error: any) {
			setAuthState({
				data: null,
				error: error.response.data.errorMessage,
				loading: false,
			});
		}
	};

	const signup = async (
		{
			firstName,
			lastName,
			email,
			password,
			city,
			phone,
		}: {
			firstName: string;
			lastName: string;
			email: string;
			password: string;
			city: string;
			phone: string;
		},
		handleClose: () => void
	) => {
		setAuthState({
			data: null,
			error: null,
			loading: true,
		});

		try {
			const response = await axios.post(
				'http://localhost:3000/api/auth/signup',
				{
					firstName,
					lastName,
					email,
					password,
					city,
					phone,
				}
			);
			setAuthState({
				data: response.data,
				error: null,
				loading: false,
			});
			handleClose();
		} catch (error: any) {
			setAuthState({
				data: null,
				error: error.response.data.errorMessage,
				loading: false,
			});
		}
	};

	const signout = () => {
		deleteCookie('jwt');

		setAuthState({
			data: null,
			error: null,
			loading: false,
		});
	};

	return {
		signin,
		signup,
		signout,
	};
};

export default useAuth;
