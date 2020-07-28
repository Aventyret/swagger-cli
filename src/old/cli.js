#!/usr/bin/env node
/* 	eslint unicorn/no-reduce: "off",
	promise/prefer-await-to-then: "off",
	prefer-promise-reject-errors: "off",
	promise/no-return-wrap: "off",
	no-unused-expressions: "off",
	camelcase: "off"
*/
const fs = require('fs');
const yargs = require('yargs');
const SwaggerParser = require('@apidevtools/swagger-parser');

const home = require('./home');
const swagger = require('./swagger');
const proxy = require('./proxy');
const oidc = require('./oidc');
const configure = require('./configure');
const connect = require('./connect');

const check = () => {
	if (!fs.existsSync(home.rcPath)) {
		throw new Error('No configuration found. Run configure to create a configuration.');
	}

	return true;
};

const loadToken = () => {
	try {
		if (fs.existsSync(home.tokenPath)) {
			const tokenJson = fs.readFileSync(home.tokenPath, 'utf8');
			return JSON.parse(tokenJson);
		}
	} catch (error) {
		console.error(error);
	}

	return {};
};

const loadRc = () => {
	try {
		const rcJson = fs.readFileSync(home.rcPath, 'utf8');
		const rc = JSON.parse(rcJson);
		return {rc, ...home};
	} catch (error) {
		console.error(error);
	}

	return {};
};

const login = argv => {
	return oidc(argv)
		.then(token => {
			if (typeof token !== 'undefined') {
				fs.writeFileSync(home.tokenPath, JSON.stringify(token));
				return token;
			}
		});
};

const token = argv => {
	login(argv)
		.then(token => {
			console.info(token);
		});
};

const schema = argv => {
	login(argv)
		.then(schema => {
			console.info(schema);
		});
};

const use = argv => {
	console.log('use', argv);
};

yargs.middleware(loadRc);
yargs.command('configure', 'configure', {}, configure);
yargs.command('login', 'login', {}, login);
yargs.command('token', 'token', {}, token);
yargs.command('schema', 'schema', {}, schema);
yargs.command('get', 'get', {}, get);
yargs.command('post', 'post', {}, post);
yargs.command('put', 'put', {}, put);
yargs.command('delete', 'delete', {}, delete);
yargs.command('use [context]', 'use', yargs => {
	return yargs.positional('context', {
		type: 'string',
		default: 'default',
		describe: 'the context name'
	});
}, use);
yargs.command('connect <url>', 'connect', yargs => {
	return yargs.positional('url', {
		type: 'string',
		default: 'http....',
		describe: 'the url'
	});
}, connect);

yargs.option('cache', {
	type: 'boolean',
	description: 'Cache swagger json'
});

yargs.option('verbose', {
	type: 'boolean',
	description: 'Enable verbose output'
});

yargs.option('context', {
	type: 'string',
	description: 'Name the context for this api.',
	default: 'context'
});

yargs
	.help()
	.check(check, true)
	.alias('help', 'h');

try {
	const cache = process.argv.indexOf('--cache') > 0;
	const {rc} = loadRc();
	const token = loadToken();
	const {access_token} = token;

	const updateSchema = !(cache && fs.existsSync(home.schemaPath));
	const schema = updateSchema ? rc.schema : home.schemaPath;
	const parser = new SwaggerParser();

	parser.validate(schema, {}, (err, api) => {
		if (api && api.paths) {
			if (updateSchema) {
				fs.writeFileSync(home.schemaPath, JSON.stringify(api));
			}

			const methods = swagger.get_methods(api);
			methods.forEach(path => {
				const _method = swagger.get_method(api, path);
				const command = swagger.method_to_command(path, _method);
				const {title, definition, cmd, method} = command;
				yargs.command(cmd, title, definition, proxy.handler(access_token, rc, method, command));
			});
		}

		yargs.argv;
	});
} catch (error) {
	console.error('Onoes! The API is invalid. ' + error.message);
}
