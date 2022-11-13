const {Service, Action, Reaction} = require('../serviceComponents')
const {Buffer} = require("buffer")
const {getUserServiceData} = require("../../../utils/userData");
const Joi = require("joi");

async function getRefreshToken(code, redirect_uri) {
	const response = await fetch(`https://accounts.spotify.com/api/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
		},
		body: `code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirect_uri)}&client_id=${process.env.SPOTIFY_CLIENT_ID}`
	})
	return await response.json()
}

async function getAccessToken(refresh_token) {
	const response = await fetch(`https://accounts.spotify.com/api/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
		},
		body: `grant_type=refresh_token&client_id=${process.env.SPOTIFY_CLIENT_ID}&refresh_token=${refresh_token}`
	})
	return await response.json()
}

async function pauseMusic(ctx, spotifyService) {
	const accessToken = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), spotifyService.name))
	const response = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${accessToken.access_token}`
		}
	})
	await ctx.next()
}

async function resumeOrPlayMusic(ctx, spotifyService) {
	const accessToken = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), spotifyService.name))
	const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${accessToken.access_token}`
		}
	})
	await ctx.next()
}

async function nextMusic(ctx, spotifyService) {
	const accessToken = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), spotifyService.name))
	const response = await fetch(`https://api.spotify.com/v1/me/player/next`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${accessToken.access_token}`
		}
	})
	await ctx.next()
}

async function previousMusic(ctx, spotifyService) {
	const accessToken = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), spotifyService.name))
	const response = await fetch(`https://api.spotify.com/v1/me/player/previous`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${accessToken.access_token}`
		}
	})
	await ctx.next()
}

async function loopMusic(ctx, spotifyService) {
	const accessToken = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), spotifyService.name))
	const response = await fetch(`https://api.spotify.com/v1/me/player/repeat?state=track`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${accessToken.access_token}`
		}
	})
	await ctx.next()
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

module.exports = (area, servicesManager) => {
	const spotifyService = new Service('Spotify', "Spotify is a digital music service that gives you access to millions of songs. Applets can help you save your Discover Weekly and Release Radar playlists, share your favorite tunes, and much more.", {
		mainColor: '#2ebd59',
		secondaryColor: '#000000',
		urlSite: 'https://www.spotify.com/'
	})

	spotifyService.setAuthentification(async (code, redirect_uri) => {
		const refreshTokenData = await getRefreshToken(code, redirect_uri)
		return refreshTokenData.refresh_token
	})

	spotifyService.setCheckToken(async token => await getAccessToken(token))

	const playlistChangeAction = new Action('Playlist changed', 'Triggers when a given playlist has a song added / removed', false)
		.on('create', async ctx => {
			const access_token = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), spotifyService.name))
			const playlist = (await getMyPlaylists(access_token.access_token))
				.find(p => p.name === ctx.payload["Playlist name"])

			ctx.setActionData('spotify_playlist_name', ctx.payload["Playlist name"])
			ctx.setActionData('spotify_playlist_snapshot_id', playlist.snapshot_id)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const access_token = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), spotifyService.name))
			const playlist = (await getMyPlaylists(access_token.access_token))
				.find(p => p.name === ctx.getActionData('spotify_playlist_name'))

			if (playlist.snapshot_id !== ctx.getActionData('spotify_playlist_snapshot_id')) {
				ctx.setActionData('spotify_playlist_snapshot_id', playlist.snapshot_id)
				await ctx.next()
			}
		})

	const pauseMusicReaction = new Reaction('Pause music', 'Pause your music when triggered')
		.on('create', async (ctx) => await ctx.next())
		.on('trigger', (ctx) => pauseMusic(ctx, spotifyService))
	const playOrResumeReaction = new Reaction('Play or resume', 'Play or resume your music when triggered')
		.on('create', async (ctx) => await ctx.next())
		.on('trigger', (ctx) => resumeOrPlayMusic(ctx, spotifyService))
	const nextMusicReaction = new Reaction('Next music', 'Skip your current music when triggered')
		.on('create', async (ctx) => await ctx.next())
		.on('trigger', (ctx) => nextMusic(ctx, spotifyService))
	const previousMusicReaction = new Reaction('Previous music', 'Go to previous music when triggered')
		.on('create', async (ctx) => await ctx.next())
		.on('trigger', (ctx) => previousMusic(ctx, spotifyService))
	const loopMusicReaction = new Reaction('Loop music', 'Loop your current music when triggered')
		.on('create', async (ctx) => await ctx.next())
		.on('trigger', (ctx) => loopMusic(ctx, spotifyService))

	playlistChangeAction.validationSchema = Joi.object().keys({
		"Playlist name": Joi.string().required()
	}).unknown(true)

	spotifyService.addAction(playlistChangeAction)

	spotifyService.addReaction(
		pauseMusicReaction,
		playOrResumeReaction,
		nextMusicReaction,
		previousMusicReaction,
		loopMusicReaction
	)

	servicesManager.addService(spotifyService)
}
