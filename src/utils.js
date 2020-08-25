module.exports = {
	argsToArray: args => {
		if (args.length > 1) {
			const result = {};
			let i = 0;
			for (const a of args) {
				console.error(a);
				if (a.startsWith('--')) {
					const aa = a.slice(2);
					result[aa] = args[i + 1];
				} else if (a.startsWith('-')) {
					const aa = a.slice(1);
					result[aa] = args[i + 1];
				}

				i++;
			}

			return [result];
		}

		if (args.length === 1) {
			console.error(args[0]);
			return JSON.parse(args[0]);
		}

		return [[]];
	}
};
