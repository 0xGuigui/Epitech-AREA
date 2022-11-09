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

function sha256(plain) {
	// returns promise ArrayBuffer
	const encoder = new TextEncoder();
	const data = encoder.encode(plain);
	return window.crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(a) {
	let str = "";
	const bytes = new Uint8Array(a);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		str += String.fromCharCode(bytes[i]);
	}
	return btoa(str)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function getRandomValues(array) {
	array = array.map(e => {
		let tmp = 0;
		for (let i = 0; i < 10; i++) {
			tmp *= 10
			tmp += Math.random() % 10
		}
		return tmp
	})
	return array
}

const generateCodeChallengeFromVerifier = async (v) => {
	const hashed = await sha256(v);
	return base64urlencode(hashed);
}

const generateCodeVerifier = () => {
	let array = new Uint32Array(28);
	array = getRandomValues(array)
	return Array.from(array, dec => ("0" + dec.toString(16)).substring(-2)).join("");
}

function showToast(message) {
	ToastAndroid.show(message, ToastAndroid.SHORT);
}

module.exports = {
	isEmail,
	isIpDomain,
	isPort,
	generateCodeVerifier,
	generateCodeChallengeFromVerifier,
	showToast,
}
