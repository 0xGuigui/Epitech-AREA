const {Service, Action, Reaction} = require('../serviceComponents')
const config = require("../../../config")

async function getRefreshToken(code) {
	const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: config.twitchClientId,
			client_secret: config.twitchClientSecret,
			code,
			grant_type: 'authorization_code',
			redirect_uri: config.twitchRedirectUri
		})
	})
	return await response.json()
}

async function getAccessToken(refresh_token) {
	const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: config.twitchClientId,
			client_secret: config.twitchClientSecret,
			grant_type: 'refresh_token',
			refresh_token
		})
	})
	return await response.json()
}

async function getUserByName(access_token, name) {
	const response = await fetch(`https://api.twitch.tv/helix/users?login=${name}`, {
		headers: {
			'Authorization': `Bearer ${access_token}`,
			'Client-Id': config.twitchClientId
		}
	})
	return await response.json()
}

async function getMe(access_token) {
	const response = await fetch(`https://api.twitch.tv/helix/users`, {
		headers: {
			'Authorization': `Bearer ${access_token}`,
			'Client-Id': config.twitchClientId
		}
	})
	return await response.json()
}

async function sendWhisperByName(access_token, name, message) {
	let me = await getMe(access_token)
	me = me.data[0]
	let to = await getUserByName(access_token, name)
	to = to.data[0]
	const response = await fetch(`https://api.twitch.tv/helix/whispers?from_user_id=${me.id}&to_user_id=${to?.id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access_token}`,
			'Client-Id': config.twitchClientId
		},
		body: JSON.stringify({
			message
		})
	})
}

async function changeMyDescription(access_token, description = "") {
	const response = await fetch(`https://api.twitch.tv/helix/users?description=${description}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access_token}`,
			'Client-Id': config.twitchClientId
		}
	})
}

module.exports = (area, servicesManager) => {
	const twitchService = new Service('Twitch', 'Twitch - We saved you a seat in chat')

	const newProfileImageAction = new Action('newProfileImage', 'when you change your profile image')
		.on('create', async ctx => {
			const refreshTokenData = await getRefreshToken(ctx.payload.twitch_code)
			const me = await getMe(refreshTokenData.access_token)
			ctx.setActionData('twitch_refresh_token', refreshTokenData.refresh_token)
			ctx.setActionData('twitch_profile_image', me.data[0].profile_image_url)
			await ctx.next({
				'twitch_refresh_token': refreshTokenData.refresh_token
			})
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.getActionData('twitch_refresh_token'))
			const me = await getMe(accessTokenData.access_token)
			if (me.data[0].profile_image_url !== ctx.getActionData('twitch_profile_image')) {
				ctx.setActionData('twitch_profile_image', me.data[0].profile_image_url)
				await ctx.next()
			}
		})
	const newOfflineImageAction = new Action('newOfflineImage', 'when you change your offline image')
		.on('create', async ctx => {
			const refreshTokenData = await getRefreshToken(ctx.payload.twitch_code)
			const me = await getMe(refreshTokenData.access_token)
			ctx.setActionData('twitch_refresh_token', refreshTokenData.refresh_token)
			ctx.setActionData('twitch_offline_image', me.data[0].offline_image_url)
			await ctx.next({
				'twitch_refresh_token': refreshTokenData.refresh_token
			})
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.getActionData('twitch_refresh_token'))
			const me = await getMe(accessTokenData.access_token)
			if (me.data[0].offline_image_url !== ctx.getActionData('twitch_offline_image')) {
				ctx.setActionData('twitch_offline_image', me.data[0].offline_image_url)
				await ctx.next()
			}
		})

	const sendWhisperReaction = new Reaction('sendWhisper', 'sends a whisper to someone')
		.on('create', async ctx => {
			if (!ctx.env.twitch_refresh_token) {
				const refreshTokenData = await getRefreshToken(ctx.payload.twitch_code)

				ctx.setActionData('twitch_refresh_token', refreshTokenData.refresh_token)
			}
			ctx.setActionData('twitch_send_to', ctx.payload.twitch_send_to)
			ctx.setActionData('twitch_message', ctx.payload.twitch_message)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.getActionData('twitch_refresh_token'))
			await sendWhisperByName(accessTokenData.access_token, ctx.getActionData('twitch_send_to'), ctx.getActionData('twitch_message'))
			await ctx.next()
		})
	const changeDescriptionReaction = new Reaction('changeDescription', 'change your description')
		.on('create', async ctx => {
			if (!ctx.env.twitch_refresh_token) {
				const refreshTokenData = await getRefreshToken(ctx.payload.twitch_code)

				ctx.setActionData('twitch_refresh_token', refreshTokenData.refresh_token)
			}
			ctx.setActionData('twitch_new_description', ctx.payload.new_description)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.getActionData('twitch_refresh_token'))
			await changeMyDescription(accessTokenData.access_token, ctx.getActionData('twitch_new_description'))
			await ctx.next()
		})

	twitchService.addAction(
		newProfileImageAction,
		newOfflineImageAction
	)

	twitchService.addReaction(
		sendWhisperReaction,
		changeDescriptionReaction
	)

	servicesManager.addService(twitchService)
}