/* 	eslint unicorn/no-reduce: "off",
	promise/prefer-await-to-then: "off",
	prefer-promise-reject-errors: "off",
	promise/no-return-wrap: "off",
	camelcase: "off",
	unicorn/no-fn-reference-in-iterator: "off"
*/
const isNull = value => value === null;
const isUndefined = value => typeof value === 'undefined';
const isObject = object => typeof object === 'function' || (typeof object === 'object' && !isArray(object) && Boolean(object));
const isFunction = key => typeof key === 'function';
const isArray = (...args) => Array.isArray(...args);
const isArrayNonEmpty = arrary => Array.isArray(arrary) && arrary.length > 0;
const isNegative = key => Number.isInteger(key) && key < 0;
const isInteger = key => Number.isInteger(key);
const isScalar = value => typeof value === 'string' || typeof value === 'number';
const isIndexArray = args => Array.isArray(args) && args.filter && args.length && args.filter(isInteger).length === args.length;
const isKeyArray = (...args) => Array.isArray(...args) && args.filter && args.filter(isInteger).length === 0;
const filterProps = (object, properties) => properties.reduce((p, c) => {
	p[c] = object[c];
	return p;
}, {});

const filterIndex = (array, properties) => properties.reduce((p, c) => {
	p.push(array[c]);
	return p;
}, []);

const _dig = (value, keys, path = []) => {
	if (isUndefined(value) || isNull(value)) {
		return undefined;
	}

	if (isUndefined(keys) || isNull(keys) || keys.length === 0) {
		return value;
	}

	const [key, ...keyrest] = keys;

	if (isScalar(key)) {
		const newValue = value[key];
		return _dig(newValue, keyrest);
	}

	if (isArray(key)) {
		if (isObject(value)) {
			return Object.entries(value).flatMap(([k, v]) => {
				const newpath = [k, ...path];
				return _dig(v, keyrest, newpath);
			});
		}

		if (isArray(value)) {
			const indexes = key.length > 0 ? key : Object.keys(value);
			const filteredValue = filterIndex(value, indexes);
			return filteredValue.flatMap((v, k) => {
				const newpath = [k, ...path];
				return _dig(v, keyrest, newpath);
			});
		}
	}

	if (isFunction(key)) {
		const newValue = key(value, ...path);
		return _dig(newValue, keyrest);
	}
};

const dig = (value, ...keys) => {
	return _dig(value, keys, [], []);
};

dig.isObject = isObject;
dig.isFunction = isFunction;
dig.isArray = isArray;
dig.isArrayNonEmpty = isArrayNonEmpty;
dig.isNegative = isNegative;
dig.isInteger = isInteger;
dig.isScalar = isScalar;
dig.isIndexArray = isIndexArray;
dig.isKeyArray = isKeyArray;
dig.filterProps = filterProps;
dig.filterIndex = filterIndex;
module.exports = dig;
