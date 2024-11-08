import { BASE_URL, REQUEST_MAXIMUM_RETRIES } from '../constants';

export const haRequest = async (entity: string, state: boolean, retries = 0) => {
	return fetch(
		`${BASE_URL}/api/services/input_boolean/turn_${state ? 'on' : 'off'}`,
		{
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${process.env.HA_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				entity_id: `input_boolean.${entity}`
			})
		}
	).then((response: Response) => {
		if (response.ok || retries >= REQUEST_MAXIMUM_RETRIES) {
			return response;
		}
		return haRequest(entity, state, retries + 1);
	});
};

export const getUrlWithParam = (...params: string[]) => `${BASE_URL}?${params.join('&')}`;