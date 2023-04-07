import { derived, writable } from 'svelte/store';
import createPersistantStore from './createPersistantStore.js';

const KEYS = {
	SESSION_INFO: 'auth-session',
};

export const sessionInfo = createPersistantStore(KEYS.SESSION_INFO);

export const email = derived(
	sessionInfo,
	($sessionInfo) => $sessionInfo?.email || null
);

export const previousUrl = writable('');
