/* 	eslint unicorn/no-reduce: "off",
promise/prefer-await-to-then: "off",
prefer-promise-reject-errors: "off",
promise/no-return-wrap: "off",
camelcase: "off"
*/
const {Issuer, generators} = require('openid-client');
const http = require('http');
const terminator = require('http-terminator');
const openBrowser = require('open');

const port = 5001;
const hostname = 'localhost';
const redirect_uri = `http://${hostname}:${port}/login/callback`;
const response_type = 'code';
const token_endpoint_auth_method = 'none';

const server = http.createServer();
const httpTerminator = terminator.createHttpTerminator({server});
const code_verifier = generators.codeVerifier();
const code_challenge = generators.codeChallenge(code_verifier);

const discoverPromise = ({provider, client_id}) => new Promise((resolve, reject) => {
	Issuer.discover(provider)
		.then(issuer => {
			const Client = new issuer.Client({client_id, token_endpoint_auth_method});
			resolve(Client);
		})
		.catch(error => {
			reject(error);
		});
});

const startLocalServerPromise = () => new Promise((resolve, reject) => {
	try {
		server.listen(port, hostname);
		resolve('ok');
	} catch (error) {
		reject(error);
	}
});

const openAuthorizationBrowserPromise = (Client, scope) => new Promise((resolve, reject) => {
	const authorizationUri = Client.authorizationUrl({
		redirect_uri,
		response_type,
		scope,
		code_challenge,
		code_challenge_method: 'S256'
	});
	console.info(authorizationUri);
	openBrowser(authorizationUri)
		.then(() => {
			resolve('ok');
		})
		.catch(error => {
			reject(error);
		});
});

const fetchTokenPromise = Client => new Promise((resolve, reject) => {
	server.on('request', (request, response) => {
		if (!request.url.includes('/done')) {
			const parammeters = Client.callbackParams(request);
			Client.callback(redirect_uri, parammeters, {code_verifier}) // => Promise
				.then(tokenSet => {
					response.writeHead(301, {Location: redirect_uri + '/done'});
					response.end();
					resolve(tokenSet);
				}).catch(error => {
					console.error('fetchTokenPromise', error);
					reject('error');
				});
		}
	});
});

const authDonePromise = () => new Promise(resolve => {
	server.on('request', (request, response) => {
		if (request.url.indexOf('/done') > 0) {
			response.on('finish', () => {
				httpTerminator.terminate();
			});

			response.writeHead(200, 'OK');
			response.write('Authorization complete!');
			response.end();
			resolve('ok');
		}
	});
});

const login = argv =>
	new Promise((resolve, reject) => {
		if (!argv) {
			return reject('No arg');
		}

		if (!argv.rc) {
			return reject('No rc arg');
		}

		const {provider, client_id, scope} = argv.rc;

		discoverPromise({provider, client_id, scope})
			.then(Client => {
				Promise.all([
					fetchTokenPromise(Client),
					startLocalServerPromise(),
					openAuthorizationBrowserPromise(Client, scope),
					authDonePromise()
				]).then(([token]) => {
					resolve(token);
				}).catch(error => {
					reject(error);
				});
			}).catch(error => {
				reject(error);
			});
	})
		.then(token => {
			console.log(token);
		})
		.catch(error => {
			console.error(error);
		});

module.exports = login;
