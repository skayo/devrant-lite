const Fetch = require('cross-fetch');
const querystring = require('querystring');

const BASE_HEADERS = {
	Accept: 'application/json',
};

class DevRant {

	/**
	 * Helper function to create a DevRant instance and login with user credentials
	 *
	 * @param {string} username Account name or email
	 * @param {string} password Account password
	 * @param {{baseUrl: string, app: number, plat: number}} options options Options passed to the DevRant constructor
	 * @return DevRant A new DevRant instance
	 */
	static async withCredentials(username, password, options = {}) {
		const client = new DevRant(options);

		const { auth_token } = await client.post('users/auth-token', {
			username,
			password,
		});
		client.setAuthToken(auth_token);

		return client;
	}

	/**
	 * Helper function to create DevRant instance and set an auth token
	 *
	 * @param {{id: number, key: string, user_id: number}} authToken Auth token
	 * @param {{baseUrl: string, app: number, plat: number}} options Options passed to the DevRant constructor
	 * @return DevRant A new DevRant instance
	 */
	static withAuthToken(authToken, options = {}) {
		const client = new DevRant(options);
		client.setAuthToken(authToken);

		return client;
	}

	/**
	 * @param {object} [options]
	 * @param {string} [options.baseUrl="https://devrant.com/api"] Base URL
	 * @param {number} [options.app=3] App ID
	 * @param {number} [options.plat=3] Platform ID
	 */
	constructor({
		baseUrl = 'https://devrant.com/api',
		app = 3,
		plat = 3,
	} = {}) {
		this._baseUrl = baseUrl;
		this._app = app;
		this._plat = plat;
	}

	/**
	 * Parse the JSON from a Response object and add a hidden `headers` property
	 *
	 * @param {Response} response The Response object returned by Fetch
	 * @return {Promise<object>}
	 * @private
	 */
	static async _handleResponse(response) {
		const headers = response.headers;

		let data = {};
		if (headers.get('content-type') === 'application/json') {
			data = await response.json();
		}

		// Set hidden headers property on data
		Object.defineProperty(data, 'headers', {
			enumerable: false,
			writable:   false,
			value:      headers,
		});

		if (response.ok) return data;
		throw data;
	}


	/**
	 * Construct the options and url for an authenticated HTTP request to the devRant API
	 *
	 * @param {'GET'|'POST'|'DELETE'} method Request method
	 * @param {string} resource The API endpoint
	 * @param {object} parameters Request parameters
	 * @param {Object} headers Additional headers
	 * @return {{options: {headers: object, method: string, body: string|undefined}, url: string}}
	 * @private
	 */
	_makeRequest(method, resource, parameters = {}, headers = {}) {
		let url = `${this._baseUrl}/${resource}`;
		let options = {
			method,
			headers: {
				...BASE_HEADERS,
				...headers,
			},
		};

		parameters.app = this._app;
		parameters.plat = this._plat;

		if (this._token) {
			const { key, id, user_id } = this._token;

			parameters.token_key = key;
			parameters.token_id = id;
			parameters.user_id = user_id;
		}

		const queryString = querystring.stringify(parameters);

		if (method === 'GET') {
			url += '?' + queryString;
		} else {
			options.body = queryString;
		}

		return { url, options };
	}

	/**
	 * Send a GET request
	 *
	 * @param {string} resource The endpoint (e.g. `devrant/rants/1234`)
	 * @param {object} parameters Optional GET parameters.
	 * @returns {Promise<object>} Promise resolving to the response from the devRant API.
	 *   The hidden `headers` property will be set to the Response headers
	 */
	get(resource, parameters) {
		const { url, options } = this._makeRequest(
			'GET',
			resource,
			parameters,
		);

		console.log(url, options);

		return Fetch(url, options)
			.then(DevRant._handleResponse);
	}

	/**
	 * Send a POST request
	 *
	 * @param {string} resource The endpoint (e.g. `devrant/rants`)
	 * @param {object} body Optional POST parameters.
	 * @returns {Promise<object>} Promise resolving to the response from the devRant API.
	 *   The hidden `headers` property will be set to the Response headers
	 */
	post(resource, body) {
		const { url, options } = this._makeRequest(
			'POST',
			resource,
			body,
			{ 'Content-Type': 'application/x-www-form-urlencoded' },
		);

		return Fetch(url, options)
			.then(DevRant._handleResponse);
	}

	/**
	 * Send a DELETE request
	 *
	 * @param {string} resource The endpoint (e.g. `devrant/rants/1234`)
	 * @param {object} parameters Optional DELETE parameters. (Will be appended to the URL)
	 * @returns {Promise<object>} Promise resolving to the response from the devRant API.
	 *   The hidden `headers` property will be set to the Response headers
	 */
	delete(resource, parameters) {
		const { url, options } = this._makeRequest(
			'DELETE',
			resource,
			parameters,
		);

		return Fetch(url, options)
			.then(DevRant._handleResponse);
	}

	/**
	 * Returns the auth token
	 *
	 * @returns {{id: number, key: string, user_id: number}}
	 */
	getAuthToken() {
		return this._token;
	}

	/**
	 * Sets the auth token
	 *
	 * @throws Error
	 */
	setAuthToken(token) {
		if (!token || !token.id || !token.key || !token.user_id) {
			throw new Error('One or more required properties are not set in the auth token!');
		}

		this._token = token;
	}
}

module.exports = DevRant;