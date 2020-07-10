const os = require('os');
const homedir = os.homedir();
const schemaPath = `${homedir}/.saapi/schema`;
const tokenPath = `${homedir}/.saapi/token`;
const rcPath = `${homedir}/.saapi/rc`;

module.exports = {
	schemaPath,
	tokenPath,
	rcPath
};

