const test = require('ava');
const execa = require('execa');

test('main', async t => {
	const {stdout} = await execa('./src/cli.js', ['help']);
	t.truthy(stdout.includes('Commands'));
});
