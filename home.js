const os = require('os');
const homedir = os.homedir();
const schemaPath = `${homedir}/.swagger-api/schema`;
const tokenPath = `${homedir}/.swagger-api/token`;
const rcPath = `${homedir}/.swagger-api/rc`;

module.exports = {
	schemaPath,
	tokenPath,
	rcPath
};

