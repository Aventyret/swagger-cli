/* 	eslint no-unused-vars: "off",
*/
const test = require('ava');
const execa = require('execa');
const rcMod = require('../src/rc');

const {nsGet, nsSet, use, all, get, set} = rcMod(null, '/tmp/swagger-cli-test');

test('Get ns from rc', t => {
	const ns = get('ns');
	t.is(ns, 'default');
});

test('Set rc value', t => {
	set('set_value', 'foo');
	const v = get('set_value');
	t.is(v, 'foo');
});

test('Set default ns', t => {
	nsSet('set_value', 'default foo');
	const v = nsGet('set_value');
	t.is(v, 'default foo');
});

test('Get all rc', t => {
	const data = all();
	t.truthy(data.includes('ns'));
});

test('Set ns', t => {
	use('foobarNS');
	const ns = get('ns');
	use('default');
	t.is(ns, 'foobarNS');
});

test('Get non existing context value', t => {
	const v = nsGet('argh', 'default');
	t.is(v, 'default');
});

test('Set ns value', t => {
	use('foobarNS');
	nsSet('foo', 'bar');
	const c = nsGet('foo', '?');
	use('default');
	t.is(c, 'bar');
});
