/* 	eslint no-unused-vars: "off",
*/
const test = require('ava');
const dig = require('../src/dig');

test('typeof', t => {
	t.is(typeof dig, 'function');
});

test('function name', t => {
	t.is(dig.name, 'dig');
});

test('undefined value', t => {
	t.falsy(dig());
});

test('empty keys', t => {
	t.is(dig('value'), 'value');
});

test('isObject 1', t => {
	t.truthy(dig.isObject({}));
});

test('isObject 2', t => {
	t.truthy(dig.isObject({a: 1}));
});

test('isObject 3 not', t => {
	t.falsy(dig.isObject('a'));
});

test('isObject 4 not', t => {
	t.falsy(dig.isObject(1));
});

test('isObject 5 not', t => {
	t.falsy(dig.isObject([]));
});

test('isObject 6 not', t => {
	t.falsy(dig.isObject(null));
});

test('isObject 7 not', t => {
	t.falsy(dig.isObject());
});

test('filterProps', t => {
	const v = {a: 1, b: 2};
	t.deepEqual(dig.filterProps(v, ['a']), {a: 1});
});

test('filterIndex', t => {
	const v = [1, 2];
	t.deepEqual(dig.filterIndex(v, [1]), [2]);
});

test('isIndexArray', t => {
	const v = [1, 2];
	t.truthy(dig.isIndexArray(v));
});

// --
test('invalid dig key', t => {
	t.falsy(dig('value', 'missing'));
});

const value = {
	a: 1,
	b: {c: 2},
	c: [3, 4],
	d: {e: 5, f: 6},
	g: [{h: 8, i: 9}]
};

const api = {
	'get': {
		'/path': {
			i: 'p'
		}
	},
	'post': {
		'/path': {
			i: 'p'
		}
	}
};
test('0', t => {
	t.is(dig(value), value);
});

test('1', t => {
	t.is(dig(value, 'a'), 1);
});

test('2', t => {
	t.deepEqual(dig(value, 'b'), {c: 2});
});

test('3', t => {
	t.is(dig(value, 'b', 'c'), 2);
});

test('4', t => {
	t.deepEqual(dig(value, 'c'), [3, 4]);
});

test('5', t => {
	t.is(dig(value, 'c', 0), 3);
});

test('6', t => {
	t.is(dig(value, 'a', v => v), 1);
});

test('6 2', t => {
	t.deepEqual(dig(api,
		[],
		v => v
	),
	[
		{
			'/path': {
				i: 'p'
			}
		},
		{
			'/path': {
				i: 'p'
			}
		}
	]);
});

test('7', t => {
	t.deepEqual(dig(api,
		[],
		(v, method) => ({method, ...v})
	),
	[
		{
			'/path': {
				i: 'p'
			},
			method: 'get'
		},
		{
			'/path': {
				i: 'p'
			},
			method: 'post'
		}
	]);
});

test('8', t => {
	t.deepEqual(dig(api,
		[],
		[],
		(v, path, method) => ({path, method, ...v})
	),
	[
		{
			i: 'p',
			method: 'get',
			path: '/path'
		},
		{
			i: 'p',
			method: 'post',
			path: '/path'
		}
	]);
});

test('dig 1', t => {
	const value = {a: 1};
	t.is(dig(value, 'a'), 1);
});

test('dig 2', t => {
	const value = {a: {b: 2}};
	t.is(dig(value, 'a', 'b'), 2);
});

test('dig 3', t => {
	const value = {a: {b: 2}};
	t.is(dig(value, 'a', ({b}) => b), 2);
});

test('dig 4', t => {
	const value = {a: {b: [1, 2]}};
	t.deepEqual(dig(value, 'a', 'b'), [1, 2]);
});

test('dig 5', t => {
	const value = {a: {b: [{c: 1}, {c: 2}]}};
	t.deepEqual(dig(value, 'a', 'b', [], 'c'), [1, 2]);
});

test('dig 6', t => {
	const value = {a: {b: [{c: 1}, {c: 2}]}};
	t.deepEqual(dig(value, 'a', 'b', [], 'c', c => c * 2), [2, 4]);
});

test('dig 7', t => {
	const value = {a: {b: [{c: 1}, {c: 2}]}};
	t.deepEqual(dig(value, 'a', 'b'), [{c: 1}, {c: 2}]);
});

test('dig 8', t => {
	const value = {a: {b: [{c: 1}, {c: 2}]}};
	t.deepEqual(dig(value, 'a', 'b', 0), {c: 1});
});

test('dig 13', t => {
	const value = [{a: 1}, {a: 2}, {a: 3}];
	t.deepEqual(dig(value, [], 'a'), [1, 2, 3]);
});

test('dig 14', t => {
	const value = [{a: 1}, {a: 2}, {a: 3}];
	t.deepEqual(dig(value, [1], 'a'), [2]);
});

test('dig 15', t => {
	const value = {a: {foo: 1}, b: {foo: 2}, c: {foo: 3}};
	t.deepEqual(dig(value, 'b', 'foo', v => [v]), [2]);
});

test('dig 16', t => {
	const value = {a: {foo: 1}, b: {foo: 2}, c: {foo: 3}};
	t.deepEqual(dig(value, [], (v, id) => ({id, ...v})), [{id: 'a', foo: 1}, {id: 'b', foo: 2}, {id: 'c', foo: 3}]);
});

test('dig 17', t => {
	const value = {a: {foo: 1}, b: {foo: 2}, c: {foo: 3}};
	t.deepEqual(dig(value, [], 'foo'), [1, 2, 3]);
});


test('dig 19', t => {
	const value = [{a: 1, b: 2}, {a: 3, b: 4}, {a: 5, b: 6}];
	t.deepEqual(dig(value, 1, ({a, b}) => [{a, b}]), [{a: 3, b: 4}]);
});

test('dig 20', t => {
	const value = [
		{name: 'name 1', i: 'query'},
		{name: 'name 2', i: 'query'},
		{name: 'name 3', i: 'path'}
	];

	t.deepEqual(dig(value, [], ({name, i}) => ({name})), [
		{name: 'name 1'},
		{name: 'name 2'},
		{name: 'name 3'}
	]
	);
});
