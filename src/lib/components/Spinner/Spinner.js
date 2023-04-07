import { writable } from 'svelte/store';

export const spinner = createSpinner();

function createSpinner() {
	const { subscribe, set } = writable(false);
	const showSpinner = () => {
		set(true);
	};
	const hideSpinner = () => {
		set(false);
	};
	return {
		subscribe,
		showSpinner,
		hideSpinner,
	};
}
