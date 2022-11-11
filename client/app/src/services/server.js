async function logUser(form) {
	const {serverUrl} = require("../../config");
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
	const {serverUrl} = require("../../config");
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
	const {serverUrl} = require("../../config");
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
	const {serverUrl} = require("../../config");
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
	const {serverUrl} = require("../../config");
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
	const {serverUrl} = require("../../config");
	console.log(serverUrl)
	console.log(serverUrl)
	console.log(serverUrl)
	console.log(serverUrl)
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

async function getServices(token) {
	const {serverUrl} = require("../../config");
	const response = await fetch(`${serverUrl}/services`, {
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

async function logOut(token) {
	const {serverUrl} = require("../../config");
	const response = await fetch(`${serverUrl}/logout`, {
		method: 'POST',
		headers : {
			'Authorization': `Bearer ${token}`
		}
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

async function deleteAccount(userInfo) {
	const {serverUrl} = require("../../config");
	const response = await fetch(`${serverUrl}/me`, {
		method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${userInfo.token}`
		}
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

async function changeUsername(token, username) {
	const {serverUrl} = require("../../config");
	const response = await fetch(`${serverUrl}/me`, {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({username})
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

async function registerService(token, service, code) {
	const {serverUrl, Oauth2} = require("../../config");
	const response = await fetch(`${serverUrl}/oauth2/${service}?mobile=true`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({"code": code, "redirect_uri": Oauth2[service].redirect_uri})
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

async function checkService(token, service) {
	const {serverUrl} = require("../../config");
	const response = await fetch(`${serverUrl}/oauth2/${service}/check-token`, {
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

async function deleteAction(token, actionId) {
	const {serverUrl} = require("../../config");
	const response = await fetch(`${serverUrl}/me/actions/${actionId}`, {
		method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	})
	const json = await response.json()
	return {
		status: response.status,
		...json
	}
}

async function getActionByName(token, serviceName, actionName) {
	const {serverUrl} = require("../../config");
	const response = await fetch(`${serverUrl}/services/${serviceName}/actions/${actionName}`, {
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

async function getReactionByName(token, serviceName, reactionName) {
	const {serverUrl} = require("../../config");
	const response = await fetch(`${serverUrl}/services/${serviceName}/reactions/${reactionName}`, {
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

async function registerArea(token, area) {
	const {serverUrl} = require("../../config");
	const response = await fetch(`${serverUrl}/me/actions`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			actionType: `${area.action.serviceName}/${area.action.name}`,
			reactionType: `${area.reaction.serviceName}/${area.reaction.name}`,
			name: area.name,
			...area.action.data,
			...area.reaction.data
		})
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
	getActions,
	getServices,
	logOut,
	deleteAccount,
	changeUsername,
	registerService,
	checkService,
	deleteAction,
	getActionByName,
	getReactionByName,
	registerArea
}
