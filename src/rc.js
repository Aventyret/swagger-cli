const fs = require('fs');
const os = require('os');
const fspath = require('path');
const NS = 'ns';
const DEFAULT_CONTEXT = 'aventyret-rc';

const makePathFactory = (context, homedir) => {
	const makepath = (...parts) => {
		homedir = homedir || os.homedir();
		context = context || DEFAULT_CONTEXT;
		const rel = parts.join('/');
		const path = `${homedir}/.${context}/${rel}`;
		const dir = fspath.dirname(path);

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		return path;
	};

	makepath();

	return makepath;
};

const list = path => {
	try {
		if (fs.existsSync(path)) {
			return fs.readdirSync(path);
		}
	} catch (error) {
		console.error(error);
	}

	return [];
};

const load = path => {
	try {
		if (fs.existsSync(path)) {
			return JSON.parse(fs.readFileSync(path, 'utf8'));
		}
	} catch (error) {
		console.error(error);
	}

	return undefined;
};

const save = (path, data) => {
	try {
		fs.writeFileSync(path, JSON.stringify(data));
	} catch (error) {
		console.error(error);
	}
};

module.exports = (context, homedir) => {
	const makepath = makePathFactory(context, homedir);

	const ns = makepath(NS);
	if (!fs.existsSync(ns)) {
		fs.writeFileSync(ns, JSON.stringify('default'));
	}

	const set = (key, value) => {
		const path = makepath(key);
		save(path, value);
	};

	const get = (key, _default = '') => {
		const path = makepath(key);
		const data = load(path);
		if (typeof data === 'undefined') {
			return _default;
		}

		return data;
	};

	const all = () => list(makepath());

	const use = ns => set(NS, ns);

	const nsSet = (key, value) => {
		const ns = get(NS, 'default');
		const path = makepath(ns, key);
		save(path, value);
	};

	const nsGet = (key, _default = '') => {
		const ns = get(NS, 'default');
		const path = makepath(ns, key);
		const data = load(path);
		if (typeof data === 'undefined') {
			return _default;
		}

		return data;
	};

	return {
		NS,
		nsSet,
		nsGet,
		get,
		set,
		use,
		list,
		all
	};
};

