const {ToastAndroid} = require("react-native");

function isEmail(email) {
	const re =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.toLowerCase());
}

function isIpDomain(domain) {
	const reIP =
		/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	const reDomain = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/;
	return reIP.test(domain) || reDomain.test(domain);
}

function isPort(port) {
	const re = /^([0-9]{1,5})$/;
	return re.test(port);
}

function showToast(message) {
	ToastAndroid.show(message, ToastAndroid.SHORT);
}

module.exports = {
	isEmail,
	isIpDomain,
	isPort,
	showToast,
}
