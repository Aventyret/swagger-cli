const prompt = require('prompt');
const fs = require('fs');
const home = require('./home');

const configure = argv => {
	console.log('Configure api cli:');
	const {api, schema, provider, clientId, scope} = argv.rc || {};
	const properties = [
		{
			description: 'Api, base url ',
			name: 'api',
			default: api
		},
		{
			description: 'Swagger, schema url ',
			name: 'schema',
			default: schema
		},
		{
			description: 'OpenID Connect, provider ',
			name: 'provider',
			default: provider
		},
		{
			description: 'OpenID Connect, clientId ',
			name: 'clientId',
			default: clientId
		},
		{
			description: 'OpenID Connect, scope ',
			name: 'scope',
			default: scope
		}
	];

	prompt.message = '';
	prompt.delimiter = ':';
	prompt
		.start()
		.get(properties, (err, result) => {
			if (err) {
				console.log(err);
				return 1;
			}

			fs.writeFileSync(home.rcPath, JSON.stringify(result));
		});
};

module.exports = configure;