/* 	eslint unicorn/no-reduce: "off",
	promise/prefer-await-to-then: "off",
	prefer-promise-reject-errors: "off",
	promise/no-return-wrap: "off",
	camelcase: "off"
*/
const SwaggerParser = require('@apidevtools/swagger-parser');
const dig = require('./dig');
const {nsGet} = require('./rc')();
const client = require('./client');
const {argsToArray} = require('../src/utils');

const request = sw => method => (path, _, args = []) => {
	const parameters = sw.args(method, path);
	const pMap = {};
	parameters.forEach(p => {
		pMap[p.name] = p;
	});
	const argsArray = argsToArray(args);
	const inBody = {};
	const inQuery = {};
	const inPath = {};
	for (const theArgs of argsArray) {
		for (let [key, value] of Object.entries(theArgs)) {
			const pa = pMap[key];
			if (pa) {
				if (pa.type === 'integer') {
					value = Number.parseInt(value, 10);
				}

				if (pa.type === 'string') {
					value = `${value}`;
				}

				if (pa.in === 'body') {
					inBody[key] = value;
				}

				if (pa.in === 'query') {
					inQuery[key] = value;
				}

				if (pa.in === 'path') {
					inPath[key] = value;
				}
			}
		}

		const {access_token} = nsGet('token');
		const c = client(access_token, sw.base());
		c.request(method, path, {inBody, inQuery, inPath});
	}
};

const info = sw => (method, path) => {
	let paths = sw.paths();
	if (path) {
		paths = paths.filter(p => p.path === path);
	}

	if (method) {
		paths = paths.filter(p => p.method === method);
	}

	paths.forEach(({path, method}) => {
		const parameters = sw.args(method, path);
		const parameters_info = parameters.map(m => m.name).join(',');
		console.log(`${method} ${path} ${parameters_info}`);
		console.log(JSON.stringify(parameters));
	});
};

module.exports = async schema => {
	let api = null;
	let valid = false;

	try {
		api = await SwaggerParser.validate(schema);
		valid = true;
	} catch (error) {
		console.error(error);
	}

	const paths = () => dig(api.paths, [], [], (o, method, path) => ({path, method}));
	const requestBody = (method, path) => dig(api.paths, path, method, 'requestBody', 'content', 'application/json', 'schema', 'properties', [], (v, name) => ({in: 'body', name, ...v})) || [];
	const parameters = (method, path) => dig(api.paths, path, method, 'parameters', [], ({name, in: i, schema: {format, type}}) => ({name, in: i, format, type})) || [];
	const base = () => dig(api.servers, 0, 'url', url => new URL(url, schema).toString());
	const args = (method, path) => [
		...requestBody(method, path),
		...parameters(method, path)
	];

	const sw = {
		api,
		valid,
		paths,
		parameters,
		requestBody,
		args,
		base
	};

	sw.request = request(sw);
	sw.info = info(sw);
	return sw;
};

