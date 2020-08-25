/* 	eslint unicorn/no-reduce: "off",
	promise/prefer-await-to-then: "off",
	prefer-promise-reject-errors: "off",
	promise/no-return-wrap: "off",
	no-unused-expressions: "off",
	camelcase: "off"
*/
const oidc = require('./oidc');
const {nsGet, nsSet} = require('./rc')();
const login = () => {
	const rc = nsGet('rc');
	return oidc(rc)
		.then(token => {
			if (typeof token !== 'undefined') {
				nsSet('token', token);
				return token;
			}
		});
};

module.exports = login;
