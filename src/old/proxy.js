/* 	eslint unicorn/no-reduce: "off",
	promise/prefer-await-to-then: "off",
	prefer-promise-reject-errors: "off",
	promise/no-return-wrap: "off",
	camelcase: "off"
*/
require('dotenv').config();
const fetch = require('node-fetch');

const handler = (token, rc, method, command) => parameters => {
	const {definition, cmd} = command;
	parameters = Object.keys(definition).reduce((previous, curr) => {
		previous[curr] = parameters[curr];
		return previous;
	}, {});

	const headers = () => ({
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`
	});

	const post = (uri, data) => {
		return fetch(`${rc.api}${uri}`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: headers()
		})
			.then(response => {
				if (!response.ok) {
					console.log(response.status);
					console.log(`${rc.api}${uri}`, data);
					if (response.status === 401) {
						return response.text().then(() => Promise.reject({status: response.status, message: 'Unauthorized'}));
					}

					const errors = JSON.parse(response.message) || response.message;
					return response.text().then(() => Promise.reject({status: response.status, ...errors}));
				}

				return Promise.resolve(response.json());
			});
	};

	const put = (uri, data) => {
		return fetch(`${rc.api}${uri}`, {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: headers()
		})
			.then(response => {
				if (!response.ok) {
					console.log(response.status);
					console.log(uri, data);
					if (response.status === 401) {
						return response.text().then(() => Promise.reject({status: response.status, message: 'Unauthorized'}));
					}

					const errors = JSON.parse(response.message) || response.message;
					return response.text().then(() => Promise.reject({status: response.status, ...errors}));
				}

				return Promise.resolve(response.json());
			});
	};

	const get = (uri, parameters = {}) => {
		const url = new URL(`${rc.api}${uri}`);
		url.search = new URLSearchParams(parameters).toString();
		const h = {
			method: 'GET',
			headers: headers()
		};
		return fetch(url, h)
			.then(response => {
				if (!response.ok) {
					console.log(response.status);
					console.log(url);
					if (response.status === 401) {
						return response.text().then(() => Promise.reject({status: response.status, message: 'Unauthorized'}));
					}

					return response.text().then(message => Promise.reject({status: response.status, message}));
				}

				return Promise.resolve(response.json());
			});
	};

	switch (method) {
		case 'get':
			get(cmd, parameters)
				.then(response => {
					console.log(JSON.stringify(response, null, 4));
				})
				.catch(error => {
					console.log(JSON.stringify(error, null, 4));
				});
			break;
		case 'post':
			post(cmd, parameters)
				.then(response => {
					console.log(JSON.stringify(response, null, 4));
				})
				.catch(error => {
					console.log(JSON.stringify(error, null, 4));
				});
			break;
		case 'put':
			put(cmd, parameters)
				.then(response => {
					console.log(JSON.stringify(response, null, 4));
				})
				.catch(error => {
					console.log(JSON.stringify(error, null, 4));
				});
			break;
		default:
			break;
	}
};

module.exports = {
	handler
};
