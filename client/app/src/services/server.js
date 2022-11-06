const {serverUrl} = require("../../config");

async function logUser(form) {
	const response = await fetch(`${serverUrl}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(form)
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

async function registerUser(form) {
	const response = await fetch(`${serverUrl}/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(form)
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

async function refreshToken() {
	const response = await fetch(`${serverUrl}/refresh`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

async function resetPassword(email) {
	const response = await fetch(`${serverUrl}/reset-password`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({email})
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

async function getMe(token) {
	const response = await fetch(`${serverUrl}/me`, {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

async function getActions(token, page = 1) {
	const response = await fetch(`${serverUrl}/me/actions?page=${page}`, {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

module.exports = {
	logUser,
	registerUser,
	refreshToken,
	resetPassword,
	getMe,
	getActions
}