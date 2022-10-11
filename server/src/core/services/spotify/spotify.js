const {Service, Action, Reaction} = require('../serviceComponents')
const {Buffer} = require("buffer");

async function getRefreshToken(code) {
	const response = await fetch(`https://accounts.spotify.com/api/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
		},
		body: `code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirect_uri)}&client_id=${clientId}`
	})
	return await response.json()
}

async function getAccessToken(refresh_token) {
	const response = await fetch(`https://accounts.spotify.com/api/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
		},
		body: `grant_type=refresh_token&client_id=${clientId}&refresh_token=${refresh_token}`
	})
	return await response.json()
}

async function pauseMusic(access_token) {
	const response = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${access_token}`
		}
	})
}

async function resumeOrPlayMusic(access_token) {
	const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${access_token}`
		}
	})
}

async function nextMusic(access_token) {
	const response = await fetch(`https://api.spotify.com/v1/me/player/next`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${access_token}`
		}
	})
}

async function previousMusic(access_token) {
	const response = await fetch(`https://api.spotify.com/v1/me/player/previous`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${access_token}`
		}
	})
}

async function loopMusic(access_token) {
	const response = await fetch(`https://api.spotify.com/v1/me/player/repeat?state=track`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${access_token}`
		}
	})
}

async function getMe(access_token) {
	const response = await fetch(`https://api.spotify.com/v1/me`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${access_token}`
		}
	})
	return await response.json()
}

async function getMyPlaylists(access_token) {
	const me = await getMe(access_token)
	const playlists = []
	let tmp = []
	let offset = 0
	do {
		const response = await fetch(`https://api.spotify.com/v1/users/${me.id}/playlists?offset=${offset}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${access_token}`
			}
		})
		const json = await response.json()
		tmp = json?.items || []
		playlists.push(...tmp)
		offset += 20
	} while (tmp.length !== 0)
	//playlist.snapshot_id pour voir si elle a changée
	return playlists
}

async function createToken(payload) {
	const code = payload.code
	const refresh_token = await getRefreshToken(code)

	return {
		refresh_token: refresh_token.refresh_token
	}
}

module.exports = (area, servicesManager) => {
	let spotifyService = new Service('Spotify', "no desc")
	let onPlaylistChange = new Action('onPlaylistChange', 'When a playlist you own has changed', false)
	let pauseMusic = new Reaction('pauseMusic', 'Pause your music')

	pauseMusic.setFunction('onCreate', createToken).setFunction('onTrigger', async (action) => {
		const accessToken = await getAccessToken(action.data.refresh_token)
		const response = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${accessToken.access_token}`
			}
		})
	})

	onPlaylistChange.setFunction('onCreate', async (payload) => {
		const code = payload.code
		const playlistName = payload.playlistName
		const refreshToken = await getRefreshToken(code)
		const access_token = await getAccessToken(refreshToken.refresh_token)

		const playlists = await getMyPlaylists(access_token.access_token)
		const playlist = playlists.find(e => e.name === playlistName)
		return {
			refresh_token: refreshToken.refresh_token,
			playlistName: playlistName,
			snapshot_id: playlist.snapshot_id
		}
	}).setFunction('onTrigger', async (action, reaction) => {
		const access_token = await getAccessToken(action.data.refresh_token)

		const playlists = await getMyPlaylists(access_token.access_token)
		const playlist = playlists.find(e => e.name === action.data.playlistName)
		if (playlist.snapshot_id !== action.data.snapshot_id)
			reaction.onTrigger(action)
	})

	spotifyService.addAction(onPlaylistChange)
	spotifyService.addReaction(pauseMusic)
	servicesManager.addService(spotifyService)
}
