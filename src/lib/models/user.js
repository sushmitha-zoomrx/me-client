import { sessionInfo } from '../stores/auth.store';

export async function login({ useremail }) {
	sessionInfo.set({
		email: useremail,
	});
}




