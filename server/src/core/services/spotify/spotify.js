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

async function pauseMusic(ctx) {
	const accessToken = await getAccessToken(ctx.getActionData('spotify_refresh_token'))
	const response = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${accessToken.access_token}`
		}
	})
	await ctx.next()
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

async function createToken(ctx) {
	if (!ctx.env.spotifyRefreshToken) {
		const refreshToken = await getRefreshToken(ctx.payload.code)

		ctx.setActionData('spotify_refresh_token', refreshToken.refresh_token)
	}
	await ctx.next()
}

module.exports = (area, servicesManager) => {
	let spotifyService = new Service('Spotify', "Spotify - control your music")
	let playlistChangeAction = new Action('onPlaylistChange', 'catch playlist changes', false)
		.on('create', async (ctx) => {
			const refreshToken = await getRefreshToken(ctx.payload.spotify_code)
			const access_token = await getAccessToken(refreshToken.refresh_token)
			const playlist = (await getMyPlaylists(access_token.access_token))
				.find(p => p.name === ctx.payload.playlistName)

			ctx.setActionData('spotify_refresh_token', refreshToken.refresh_token)
			ctx.setActionData('spotify_playlist_name', ctx.payload.playlistName)
			ctx.setActionData('spotify_playlist_snapshot_id', playlist.snapshot_id)
			await ctx.next({spotifyRefreshToken: refreshToken.refresh_token})
		})
		.on('trigger', async (ctx) => {
			const access_token = await getAccessToken(ctx.getActionData('spotify_refresh_token'))
			const playlist = (await getMyPlaylists(access_token.access_token))
				.find(p => p.name === ctx.getActionData('spotify_playlist_name'))

			if (playlist.snapshot_id !== ctx.getActionData('spotify_playlist_snapshot_id')) {
				ctx.setActionData('spotify_playlist_snapshot_id', playlist.snapshot_id)
				await ctx.next()
			}
		})
	let pauseMusicReaction = new Reaction('pauseMusic', 'pause your music when your action is triggered')
		.on('create', createToken)
		.on('trigger', pauseMusic)

	spotifyService.addAction(playlistChangeAction)
	spotifyService.addReaction(pauseMusicReaction)
	servicesManager.addService(spotifyService)
}
