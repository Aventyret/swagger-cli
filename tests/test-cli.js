/* 	eslint no-unused-vars: "off",
*/
const test = require('ava');
const execa = require('execa');
const {argsToArray} = require('../src/utils');

test('cli 1', t => {
	const major = process.versions.node.split('.')[0];
	t.is(major, '12');
});
