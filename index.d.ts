/**
 * Typings for devrant-lite
 *
 * @version 1.0
 * @author Skayo (https://skayo.dev)
 *
 * @example
 * const DevRant = require('devrant-lite')
 *
 * const client = new DevRant({
 *  consumer_key: 'XYZ',
 *  consumer_secret: 'XYZ',
 *  access_token_key: 'XYZ',
 *  access_token_secret: 'XYZ'
 * });
 *
 * @example
 * // Enable esModuleInterop in your tsconfig to import typings
 * import DevRant, { DevRantOptions } from 'devrant-lite'
 *
 * const config: DevRantOptions = {
 *  token: {
 *   key: '123abcdefghijklmnopqrstuvxyz',
 *   id: 12345678,
 *   user_id: 12345
 *  }
 * };
 *
 * const client = new DevRant(config);
 */

/// <reference types="node" />

export default class DevRant {
	private _token: AuthToken;
	private _baseUrl: string;
	private _app: string;
	private _plat: string;

	constructor(options: TwitterOptions);

	/**
	 * Parse the JSON from a Response object and add a hidden `headers` property
	 */
	private static _handleResponse(response: Response): Promise<object>;

	/**
	 * Construct the options and url for an authenticated HTTP request to the devRant API
	 * @param {'GET'|'POST'|'DELETE'} method Request method
	 * @param {string} resource The API endpoint
	 * @param {object} parameters Request parameters
	 * @param {Object} headers Additional headers added to base headers
	 */
	private _makeRequest(
		method: 'GET' | 'POST' | 'DELETE',
		resource: string,
		parameters: object,
		headers: object,
	): {
		url: string,
		options: {
			headers: object,
			method: string,
			body: string | undefined
		}
	};

	/**
	 * Send a GET request
	 *
	 * @param {string} resource The endpoint (e.g. `devrant/rants/1234`)
	 * @param {object} parameters Optional GET parameters.
	 * @returns {Promise<object>} Promise resolving to the response from the devRant API.
	 *   The hidden `headers` property will be set to the Response headers
	 */
	public get<T = any>(resource: string, parameters?: object): Promise<T>;

	/**
	 * Send a POST request
	 *
	 * @param {string} resource The endpoint (e.g. `devrant/rants`)
	 * @param {object} body Optional POST parameters.
	 * @returns {Promise<object>} Promise resolving to the response from the devRant API.
	 *   The hidden `headers` property will be set to the Response headers
	 */
	public post<T = any>(resource: string, body?: object): Promise<T>;

	/**
	 * Send a DELETE request
	 *
	 * @param {string} resource The endpoint (e.g. `devrant/rants/1234`)
	 * @param {object} parameters Optional DELETE parameters. (Will be appended to the URL)
	 * @returns {Promise<object>} Promise resolving to the response from the devRant API.
	 *   The hidden `headers` property will be set to the Response headers
	 */
	public delete<T = any>(resource: string, parameters?: object): Promise<T>;
}

interface TwitterOptions {
	/**
	 * Auth Token (usually returned from the `users/auth-token` endpoint)
	 */
	token: AuthToken | null,

	/**
	 * API Base URL (useful for proxying and testing)
	 * @default https://devrant.com/api
	 */
	baseUrl: string,

	/**
	 * App ID
	 * @default 3
	 */
	app: number,

	/**
	 * Platform ID
	 * @default 3
	 */
	plat: number
}

interface AuthToken {
	id: number;
	key: string;
	user_id: number
}