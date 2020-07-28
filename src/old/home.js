const fs = require('fs');
const os = require('os');
const homedir = os.homedir();
const homePath = () => `${homedir}/.swagger-api`;
const contextPath = context => `${homedir}/.swagger-api/${context}`;
const schemaPath = context => `${homedir}/.swagger-api/${context}/schema`;
const tokenPath = context => `${homedir}/.swagger-api/${context}/token`;
const rcPath = context => `${homedir}/.swagger-api/${context}/rc`;

const contextIndex = process.argv.indexOf('--context') + 1;

const home = homePath();
if (!fs.existsSync(home)) {
	fs.mkdirSync(home);
}

let context = 'context';
if (contextIndex > 0 && contextIndex < process.argv.length) {
	context = process.argv[contextIndex];
}

const path = contextPath(context);
const schema = schemaPath(context);
const token = tokenPath(context);
const rc = rcPath(context);

if (!fs.existsSync(path)) {
	fs.mkdirSync(path);
}

if (!fs.existsSync(schema)) {
	fs.writeFileSync(schema, '{paths:{}}');
}

if (!fs.existsSync(token)) {
	fs.writeFileSync(token, '{}');
}

if (!fs.existsSync(rc)) {
	fs.writeFileSync(rc, '{}');
}

module.exports = {
	schemaPath: schema,
	tokenPath: token,
	rcPath: rc
};

