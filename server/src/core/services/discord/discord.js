const {Service, Action, Reaction} = require('../serviceComponents')
const mongoose = require("mongoose");
const {ref} = require("joi");

async function getRefreshToken(code) {
	const response = await fetch(`https://discord.com/api/oauth2/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			client_id: process.env.DISCORD_CLIENT_ID,
			client_secret: process.env.DISCORD_CLIENT_SECRET,
			redirect_uri: process.env.DISCORD_REDIRECT_URI,
			code,
			grant_type: 'authorization_code'
		})
	})
	return await response.json()
}

async function getAccessToken(refresh_token) {
	const response = await fetch(`https://discord.com/api/oauth2/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			client_id: process.env.DISCORD_CLIENT_ID,
			client_secret: process.env.DISCORD_CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token
		})
	})
	return await response.json()
}

async function getMe(access_token) {
	const response = await fetch(`https://discord.com/api/v10/users/@me`, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${access_token}`
		}
	})
	//data.avatar && data.name
	return await response.json()
}

async function getMyGuilds(access_token) {
	const response = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${access_token}`
		}
	})
	return await response.json()
}

async function changeUsername(access_token, username = "WhatWereYouExpecting") {
	const response = await fetch(`https://discord.com/api/v10/users/@me`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${access_token}`
		},
		body: new URLSearchParams({
			username
		})
	})
	return await response.json()
}

async function saveRefreshToken(refresh_token, userId, serviceName, ctx) {
	const user = await mongoose.model('User')
		.findById(userId)
		.exec()
	user.data[serviceName] = refresh_token
	if (ctx)
		ctx.actionData.user.data[discordService.name] = refresh_token
	await user.save()
}

module.exports = (area, servicesManager) => {
	const discordService = new Service('Discord', "Discord - your place to talk")

	discordService.setAuthentification(async (code) => {
		const refreshData = await getRefreshToken(code)
		return refreshData.refresh_token
	})

	discordService.checkToken(async (token, userId) => {
		const accessTokenData = await getAccessToken(token)
		if (accessTokenData?.refresh_token)
			await saveRefreshToken(accessTokenData?.refresh_token, userId, discordService.name)
		return accessTokenData
	})

	const avatarChangeAction = new Action('avatarChange', 'when you change your avatar')
		.on('create', async ctx => {
			const accessTokenData = await getAccessToken(ctx.actionData.user.data[discordService.name])
			const me = await getMe(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user._id, discordService.name, ctx)
			ctx.setActionData('discord_avatar_id', me.avatar)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.actionData.user.data[discordService.name])
			const me = await getMe(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user._id, discordService.name, ctx)
			if (me.avatar !== ctx.getActionData('discord_avatar_id')) {
				ctx.setActionData('discord_avatar_id', me.avatar)
				return await ctx.next()
			}
			await ctx.end()
		})
	const usernameChangeAction = new Action('usernameChange', 'when you change your username')
		.on('create', async ctx => {
			const accessTokenData = await getAccessToken(ctx.actionData.user.data[discordService.name])
			const me = await getMe(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user._id, discordService.name, ctx)
			ctx.setActionData('discord_username', me.username)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.actionData.user.data[discordService.name])
			const me = await getMe(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user._id, discordService.name, ctx)
			if (me.username !== ctx.getActionData('discord_username')) {
				ctx.setActionData('discord_username', me.username)
				return await ctx.next()
			}
			await ctx.end()
		})
	const joinedServerAction = new Action('joinedNewServer', 'when you join a new server')
		.on('create', async ctx => {
			const accessTokenData = await getAccessToken(ctx.actionData.user.data[discordService.name])
			const myGuilds = await getMyGuilds(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user._id, discordService.name, ctx)
			ctx.setActionData('discord_guild_number', myGuilds.length)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.actionData.user.data[discordService.name])
			const myGuilds = await getMe(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user._id, discordService.name, ctx)
			if (myGuilds.length > ctx.getActionData('discord_guild_number')) {
				ctx.setActionData('discord_guild_number', myGuilds.length)
				return await ctx.next()
			}
			ctx.setActionData('discord_guild_number', myGuilds.length)
			await ctx.end()
		})
	const leftServerAction = new Action('leftServer', 'when you leave a new server')
		.on('create', async ctx => {
			const accessTokenData = await getAccessToken(ctx.actionData.user.data[discordService.name])
			const myGuilds = await getMyGuilds(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user._id, discordService.name, ctx)
			ctx.setActionData('discord_guild_number', myGuilds.length)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.actionData.user.data[discordService.name])
			const myGuilds = await getMe(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user._id, discordService.name, ctx)
			if (myGuilds.length < ctx.getActionData('discord_guild_number')) {
				ctx.setActionData('discord_guild_number', myGuilds.length)
				return await ctx.next()
			}
			ctx.setActionData('discord_guild_number', myGuilds.length)
			await ctx.end()
		})

	const changeUsernameReaction = new Reaction('changeUsername', 'changes your username')
		.on('create', async ctx => {
			ctx.setActionData('discord_new_name', ctx.payload.discord_new_name)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.actionData.user.data[discordService.name])
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user._id, discordService.name, ctx)
			await changeUsername(accessTokenData.access_token, ctx.getActionData('discord_new_name'))
			await ctx.end()
		})

	discordService.addAction(
		avatarChangeAction,
		usernameChangeAction,
		joinedServerAction,
		leftServerAction
	)

	discordService.addReaction(changeUsernameReaction)

	servicesManager.addService(discordService)
}