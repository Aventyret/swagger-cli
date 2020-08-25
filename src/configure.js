/* eslint camelcase: "off"
*/

const prompt = require('prompt');
const {nsGet, nsSet} = require('./rc')();
const configure = () => {
	console.log('Configure api cli 2:');
	console.log(nsGet('rc'));
	const {schema, provider, client_id, scope} = nsGet('rc', {});
	const properties = [
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
			description: 'OpenID Connect, client_id ',
			name: 'client_id',
			default: client_id
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

			nsSet('rc', result);
		});
};

module.exports = configure;
