/* 	eslint no-unused-vars: "off",
*/
const test = require('ava');
const swaggr = require('../src/swaggr');

test.before(async t => {
	const sw = await swaggr('http://localhost:5000/swagger/v1/swagger.json');
	t.context = sw;
});

test('petstore.swagger',  t => {
	const sw = t.context;
	t.is(sw.valid, true);
});

test('base', t => {
	const sw = t.context;
	t.is(sw.base(), 'http://localhost:5000/api/');
});

test('prognoswebben.swagger',  t => {
	const sw = t.context;
	t.is(sw.valid, true);
});

test('1', t => {
	const sw = t.context;
	const paths = sw.paths();
	t.deepEqual(paths[0], {
		method: 'get',
		path: '/api/region/list'
	});
});

test('2', t => {
	const sw = t.context;
	const parameters = sw.parameters('get', '/api/region/get');
	t.deepEqual(parameters, [{
		format: 'uuid',
		in: 'query',
		name: 'id',
		type: 'string'
	}]);
});

test('3', t => {
	const sw = t.context;
	const body = sw.requestBody('post', '/api/forecast/add');
	t.deepEqual(body, [
		{
			name: 'name',
			in: 'body',
			nullable: true,
			type: 'string'
		},
		{
			name: 'method',
			in: 'body',
			nullable: true,
			type: 'string'
		},
		{
			format: 'date-time',
			name: 'periodStartAt',
			in: 'body',
			type: 'string'
		},
		{
			format: 'date-time',
			name: 'periodEndAt',
			in: 'body',
			type: 'string'
		},
		{
			format: 'date-time',
			name: 'deadlineAt',
			in: 'body',
			type: 'string'
		},
		{
			format: 'uuid',
			name: 'referenceForecastId',
			in: 'body',
			type: 'string'
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
		}
	]);
});
