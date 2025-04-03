import { sessionInfo } from '../stores/auth.store';

export async function login() {
	sessionInfo.set({
		email: 'demo@example.com',
	});
}




