//useAuthActions.ts
import { external, login, logout, register } from '../api/auth';
import { useAuth } from './useAuth';

export function useAuthActions() {
	const { setAuthenticated } = useAuth();

	async function loginWithPassword(email: string, password: string) {
		const response = await login(email, password);
		setAuthenticated(true);
		return response;
	}

	async function loginWithGoogle(idToken: string) {
		const response = await external('Google', idToken);
		setAuthenticated(true);
		return response;
	}

	async function registerUser(
		displayName: string,
		email: string,
		password: string,
	) {
		const response = await register(displayName, email, password);
		setAuthenticated(true);
		return response;
	}

	async function logoutUser() {
		try {
			await logout();
		} finally {
			setAuthenticated(false);
		}
	}

	return {
		loginWithPassword,
		loginWithGoogle,
		registerUser,
		logoutUser,
	};
}
