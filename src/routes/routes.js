
import Chat from './Chat/Chat.svelte';
import Home from './Home/Home.svelte';
import User from './User/User.svelte';
import { wrap } from 'svelte-spa-router/wrap';
import { get } from 'svelte/store';
import { email } from '@stores/auth.store';
export const routes = {
	'/user': User,
	'/chat': wrap({
		component: Chat,

		userData: {
			redirectTo: '/user',
		},

		conditions: [() => get(email)],
	}),
	'/': Home
};
console.log(get(email))