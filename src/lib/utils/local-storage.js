export function getLocalStorageItem(key) {
	try {
		const value = localStorage.getItem(key);
		return JSON.parse(value);
	} catch (error) {
		console.error('Error in getLocalStorageItem', key, error);
		return null;
	}
}

export function setLocalStorageItem(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(error);
	}
}

export function removeLocalStorageItem(key) {
	try {
		window.localStorage.removeItem(key);
	} catch (error) {
		console.error(error);
	}
}
