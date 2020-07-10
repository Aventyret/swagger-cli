/* eslint unicorn/no-reduce: "off",
promise/prefer-await-to-then: "off",
prefer-promise-reject-errors: "off",
promise/no-return-wrap: "off",
camelcase: "off",
unicorn/no-fn-reference-in-iterator: "off"
*/
const to_parts = name => name.split('/').slice(1);
const to_cmd = name => to_parts(name).join('/');
const to_title = name => to_parts(name).reverse().join(' ');
const to_alias = name => name[0];

const to_map = (previous, curr) => {
	previous[curr.name] = curr;
	return previous;
};

const to_method = def => {
	if (def.post) {
		return 'post';
	}

	if (def.put) {
		return 'put';
	}

	if (def.get) {
		return 'get';
	}
};

const dig = (object, ...path) => {
	if (typeof object === 'undefined') {
		return undefined;
	}

	if (path.length === 0) {
		return object;
	}

	const key = path.shift();
	if (typeof object[key] !== 'undefined') {
		return dig(object[key], ...path);
	}

	return undefined;
};

const map_post = def => {
	const properties = dig(def, 'requestBody', 'content', 'application/json', 'schema', 'properties') || [];
	return Object.entries(properties)
		.map(([name, {type, format}]) =>
			({
				name,
				type,
				format,
				demand: true,
				alias: to_alias(name),
				title: to_title(name),
				description: to_title(name)
			})
		);
};

const map_put = def => {
	const properties = dig(def, 'requestBody', 'content', 'application/json', 'schema', 'properties') || [];
	return Object.entries(properties)
		.map(([name, {type, format}]) =>
			({
				name,
				type,
				format,
				demand: true,
				alias: to_alias(name),
				title: to_title(name),
				description: to_title(name)
			})
		);
};

const map_get = def => {
	const parameters = dig(def, 'parameters') || [];
	return parameters
		.map(({name, schema, type, format}) => {
			if (schema) {
				type = schema.type;
				format = schema.format;
			}

			return {
				name,
				type,
				format,
				demand: true,
				alias: to_alias(name),
				title: to_title(name),
				description: to_title(name)
			};
		}
		);
};

const get_methods = api => {
	return Object.entries(api.paths).map(([path]) => path);
};

const get_method = (api, path) => {
	return api.paths[path];
};

const method_to_command = (path, _method) => {
	const method = to_method(_method);
	const cmd = to_cmd(path);
	const title = to_title(path);
	let definition = {};

	switch (method) {
		case 'post':
			definition = map_post(_method.post).reduce(to_map, {});
			break;
		case 'put':
			definition = map_put(_method.put).reduce(to_map, {});
			break;
		case 'get':
			definition = map_get(_method.get).reduce(to_map, {});
			break;
		default:
			break;
	}

	return {cmd, title, method, definition};
};

module.exports = {
	get_methods,
	get_method,
	method_to_command
};
