module.exports = value => {
	try {
		return JSON.parse(value) && true;
	} catch (error) {
		console.error(error);
	}

	return false;
};
