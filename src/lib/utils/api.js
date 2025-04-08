import isEmpty from '@utils/is-empty.js';
import { replace } from 'svelte-spa-router';
import { sessionInfo } from '../stores/auth.store';

export const SERVER_ERROR_CODE = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INVALID_METHOD: 405,
	CONFLICT: 409,
	INVALID_ENTITY: 422,
	SERVER_ERROR: 500,
	MAINTENANCE: 503,
};

// export const get = async (
// 	url = '',
// 	params = {},
// 	headers = {},
// 	options = {}
// ) => {
// 	if (!isEmpty(params)) {
// 		url = url + '?' + new URLSearchParams(params).toString();
// 	}
// 	// headers = setBearer(headers);
// 	const response = await fetch(import.meta.env.VITE_API_URL + url, {
// 		headers: {
// 			...(!options.noContentType && {
// 				'Content-Type': 'application/json',
// 			}),
// 			// ...headers,
// 		}
// 	});

// 	return await responseHandler(response);
// };
// export const put = async (
// 	url = '',
// 	data = null,
// 	headers = {},
// 	options = {}
// ) => {
// 	// headers = setBearer(headers);
// 	const response = await fetch(import.meta.env.VITE_API_URL + url, {
// 		method: 'PUT',
// 		headers: {
// 			...(!options.noContentType && {
// 				'Content-Type': 'application/json',
// 			}),
// 			// ...headers,
// 		},
// 		referrerPolicy: 'no-referrer',
// 		body: options.noFormat ? data : JSON.stringify(data),
// 		signal: options.signal,
// 	});

// 	return await responseHandler(response);
// };

export const post = async (
	url = '',
	data = null,
	headers = {
		'Content-Type': 'application/json',
		// ...headers,
	},
	options = {}
) => {
	// headers = setBearer(headers);

	const response = await fetch(`${import.meta.env.VITE_SERVER_URL}` + url, {
		method: 'POST',
		headers: headers,
		referrerPolicy: 'no-referrer',
		signal: options.signal,
		body: data,
	});

	return await responseHandler(response);
};

async function responseHandler(response) {
	const isJson = response.headers
		.get('content-type')
		?.includes('application/json');
	let responseData = isJson ? await response.json() : null;

	if (!response.ok) {
		if (response.status === SERVER_ERROR_CODE['UNAUTHORIZED']) {
			sessionInfo.remove();
			replace('/login');
		}
		const error = (responseData && responseData.message) || response.status;
		return Promise.reject(error);
	}

	return Promise.resolve({ responseData, response });
}

// function setBearer(headers) {
// 	let sessionToken = getStore(token);
// 	if (sessionToken) {
// 		headers = {
// 			Authorization: sessionToken,
// 			...headers,
// 		};
// 	}
// 	return headers;
// }
