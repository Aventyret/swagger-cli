#!/usr/bin/env node
/* 	eslint unicorn/no-reduce: "off",
	promise/prefer-await-to-then: "off",
	prefer-promise-reject-errors: "off",
	promise/no-return-wrap: "off",
	no-unused-expressions: "off",
	camelcase: "off"
*/
const {Command} = require('commander');
const swaggr = require('./swaggr');
const configure = require('./configure');
const login = require('./login');
const {nsGet} = require('./rc')();
const program = new Command();
program.version('0.0.1');
(async () => {
	program
		.option('-v, --verbose', 'output extra debugging');

	program
		.command('login')
		.action(login);

	program
		.command('configure')
		.action(configure);

	const {schema} = nsGet('rc');
	if (schema) {
		const sw = await swaggr(schema);

		program
			.command('get <path>')
			.allowUnknownOption()
			.action(sw.request('get'));

		program
			.command('post <path>')
			.allowUnknownOption()
			.action(sw.request('post'));

		program
			.command('put <path>')
			.allowUnknownOption()
			.action(sw.request('put'));

		program
			.command('delete <path>')
			.allowUnknownOption()
			.action(sw.request('delete'));

		program
			.command('schema [method] [path]')
			.action(sw.info);
	}

	program.parse(process.argv);
})();

