#!/usr/bin/env node

const fs = require('fs');
const yargs = require('yargs');
const SwaggerParser = require('@apidevtools/swagger-parser');

const home = require('./home');
const swagger = require('./swagger');
const proxy = require('./proxy');
const oidc = require('./oidc');
const configure = require('./configure');

const check = () => {

	if (!fs.existsSync(home.rcPath)) {
		throw new Error('No configuration found. Run configure to create a configuration.')
	}

	return true;
};

const loadToken = () => {
	let token = {};
	try {
		if (fs.existsSync(home.tokenPath)) {
			const tokenJson = fs.readFileSync(home.tokenPath, 'utf8');
			token = JSON.parse(tokenJson);
		}
	} catch (error) {
		console.error(error);
	}

	return token || {};
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
		.then( token => {
			console.log(token);
		});
};

yargs.middleware(loadRc);
yargs.command('configure', 'configure', {}, configure);
yargs.command('login', 'login', {}, login);
yargs.command('token', 'token', {}, token);

yargs.option('cache', {
	type: 'boolean',
	description: 'Cache swagger json'
});

yargs.option('verbose', {
	type: 'boolean',
	description: 'Enable verbose output'
});

yargs
	.help()
	.check(check, true)
	.alias('help', 'h');

try {
	const cache = process.argv.indexOf('--cache') > 0;
	const {rc} = loadRc();
	const {accessToken} = loadToken();

	const updateSchema = !(cache && fs.existsSync(home.schemaPath));
	const schema = updateSchema ? rc.schema : home.schemaPath;
	const parser = new SwaggerParser();

	parser.validate(schema, {}, (err, api) => {
		if (updateSchema) {
			fs.writeFileSync(home.schemaPath, JSON.stringify(api));
		}

		const methods = swagger.get_methods(api);
		methods.forEach(path => {
			const _method = swagger.get_method(api, path);
			const command = swagger.method_to_command(path, _method);
			const {title, definition, cmd, method} = command;
			yargs.command(cmd, title, definition, proxy.handler(accessToken, rc, method, command));

		});

		yargs.argv();
	});
} catch (error) {
	console.error('Onoes! The API is invalid. ' + error.message);
}
