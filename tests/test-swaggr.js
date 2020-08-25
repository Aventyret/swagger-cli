/* 	eslint no-unused-vars: "off",
*/
const test = require('ava');
const swaggr = require('../src/swaggr');

test.before(async t => {
	const sw = await swaggr('http://localhost:5000/swagger/v1/swagger.json');
	t.context = sw;
});

test('petstore.swagger', t => {
	const sw = t.context;
	t.is(sw.valid, true);
});

test('base', t => {
	const sw = t.context;
	t.is(sw.base(), 'http://localhost:5000/api/');
});

test('prognoswebben.swagger', t => {
	const sw = t.context;
	t.is(sw.valid, true);
});

test('1', t => {
	const sw = t.context;
	const paths = sw.paths();
	t.deepEqual(paths[0], {
		method: 'get',
		path: '/api/error/development'
	});
});

test('2', t => {
	const sw = t.context;
	const parameters = sw.parameters('get', '/api/region/get');
	t.deepEqual(parameters, [{
		format: 'int32',
		in: 'query',
		name: 'id',
		type: 'integer'
	}]);
});

test('3', async t => {
	const sw = t.context;
	const body = await sw.requestBody('post', '/api/forecast/add');
	t.deepEqual(body, [
		{
			name: 'name',
			in: 'body',
			type: 'string'
		},
		{
			name: 'method',
			in: 'body',
			type: 'string'
		},
		{
			format: 'date-time',
			name: 'periodStartDate',
			in: 'body',
			type: 'string'
		},
		{
			format: 'date-time',
			name: 'periodEndDate',
			in: 'body',
			type: 'string'
		},
		{
			format: 'date-time',
			name: 'deadlineDate',
			in: 'body',
			nullable: true,
			type: 'string'
		},
		{
			format: 'int32',
			name: 'referenceForecastId',
			nullable: true,
			in: 'body',
			type: 'integer'
		}
	]);
});

test('4', t => {
	const sw = t.context;
	const body = sw.parameters('post', '/api/region/add');
	t.deepEqual(body, []);
});

test('5', t => {
	const sw = t.context;
	const body = sw.args('post', '/api/region/add');
	t.deepEqual(body, [
		{
			name: 'name',
			in: 'body',
			nullable: true,
			type: 'string'
		},
		{
			format: 'int32',
			in: 'body',
			name: 'id',
			type: 'integer'
		}
	]);
});
