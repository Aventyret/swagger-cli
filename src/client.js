/* 	eslint unicorn/no-reduce: "off",
	promise/prefer-await-to-then: "off",
	prefer-promise-reject-errors: "off",
	promise/no-return-wrap: "off",
	camelcase: "off"
*/
const fetch = require('node-fetch');
let count = 0;
module.exports = (token, base = '') => {
	const request = (method, command, parameters) => {
		count++;
		const {inBody, inQuery} = parameters;
		const headers = () => ({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		});
		const url = new URL(command, base);
		url.search = new URLSearchParams(inQuery).toString();
		const body = method === 'post' || method === 'put' ? JSON.stringify(inBody) : undefined;
		setTimeout(() => {
			return fetch(url.toString(), {
				method,
				body,
				headers: headers()
			})
				.then(response => {
					if (!response.ok) {
						console.log(response.status);
						console.log(url);
						if (response.status === 401) {
							return response.text().then(message => Promise.reject(message));
						}

						return response.text().then(message => Promise.reject(message));
					}

					return Promise.resolve(response.json());
				})
				.then(response => {
					console.log(JSON.stringify(response, null, 4));
				})
				.catch(error => {
					console.error(error);
				});
		}, count * 100);
	};

	return {request};
};
