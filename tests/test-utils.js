/* 	eslint no-unused-vars: "off",
*/
const test = require('ava');
const execa = require('execa');
const {argsToArray} = require('../src/utils');

test('utils 1', t => {
	const result = argsToArray(['-name', 'foo']);
	t.deepEqual(result, [{name: 'foo'}]);
});

test('utils 2', t => {
	const result = argsToArray(['[{"name":"foo"}]']);
	t.deepEqual(result, [{name: 'foo'}]);
});
