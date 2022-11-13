const {Service, Action, Reaction} = require('../serviceComponents')
const mongoose = require("mongoose");
const {ref} = require("joi");
const {getUserServiceData} = require("../../../utils/userData");
const Joi = require("joi");

async function getRefreshToken(code, redirect_uri) {
	const response = await fetch(`https://discord.com/api/oauth2/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			client_id: process.env.DISCORD_CLIENT_ID,
			client_secret: process.env.DISCORD_CLIENT_SECRET,
			redirect_uri,
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

async function saveRefreshToken(refresh_token, userId, serviceName) {
	const user = await mongoose.model('User')
		.findById(userId)
		.exec()
	user.data = {
		...user.data,
		[serviceName]: refresh_token
	}
	await user.save()
}

module.exports = (area, servicesManager) => {
	const discordService = new Service('Discord', "Whether you’re part of a school club, gaming group, worldwide art community, or just a handful of friends that want to spend time together, Discord makes it easy to talk every day and hang out more often.\n" +
		"\n", {
		mainColor: '#5f70f4',
		secondaryColor: '#acbcfc',
		urlSite: 'https://discord.com/'
	})

	discordService.setAuthentification(async (code, redirect_uri) => {
		const refreshData = await getRefreshToken(code, redirect_uri)
		return refreshData.refresh_token
	})

	discordService.setCheckToken(async (token, userId) => {
		const accessTokenData = await getAccessToken(token)
		if (accessTokenData?.refresh_token)
			await saveRefreshToken(accessTokenData?.refresh_token, userId, discordService.name)
		return accessTokenData
	})

	const avatarChangeAction = new Action('Change your Discord avatar', 'Triggers when you change your avatar')
		.on('create', async ctx => {
			const accessTokenData = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), discordService.name))
			const me = await getMe(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user.valueOf(), discordService.name)
			ctx.setActionData('discord_avatar_id', me.avatar)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), discordService.name))
			const me = await getMe(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user.valueOf(), discordService.name)
			if (me.avatar !== ctx.getActionData('discord_avatar_id')) {
				ctx.setActionData('discord_avatar_id', me.avatar)
				return await ctx.next()
			}
			await ctx.end()
		})
	const usernameChangeAction = new Action('Change your Discord username', 'Triggers when you change your username')
		.on('create', async ctx => {
			const accessTokenData = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), discordService.name))
			const me = await getMe(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user.valueOf(), discordService.name)
			ctx.setActionData('discord_username', me.username)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), discordService.name))
			const me = await getMe(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user.valueOf(), discordService.name)
			if (me.username !== ctx.getActionData('discord_username')) {
				ctx.setActionData('discord_username', me.username)
				return await ctx.next()
			}
			await ctx.end()
		})
	const joinedServerAction = new Action('Join a new Discord server', 'Triggers when you join a new server')
		.on('create', async ctx => {
			const accessTokenData = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), discordService.name))
			const myGuilds = await getMyGuilds(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user.valueOf(), discordService.name)
			ctx.setActionData('discord_guild_number', myGuilds.length)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), discordService.name))
			const myGuilds = await getMyGuilds(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user.valueOf(), discordService.name)
			if (myGuilds.length > ctx.getActionData('discord_guild_number')) {
				ctx.setActionData('discord_guild_number', myGuilds.length)
				return await ctx.next()
			}
			ctx.setActionData('discord_guild_number', myGuilds.length)
			await ctx.end()
		})
	const leftServerAction = new Action('Left a Discord server', 'Triggers when you leave a server')
		.on('create', async ctx => {
			const accessTokenData = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), discordService.name))
			const myGuilds = await getMyGuilds(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user.valueOf(), discordService.name)
			ctx.setActionData('discord_guild_number', myGuilds.length)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(await getUserServiceData(ctx.actionData.user.valueOf(), discordService.name))
			const myGuilds = await getMyGuilds(accessTokenData.access_token)
			await saveRefreshToken(accessTokenData.refresh_token, ctx.actionData.user.valueOf(), discordService.name)
			if (myGuilds.length < ctx.getActionData('discord_guild_number')) {
				ctx.setActionData('discord_guild_number', myGuilds.length)
				return await ctx.next()
			}
			ctx.setActionData('discord_guild_number', myGuilds.length)
			await ctx.end()
		})

	discordService.addAction(
		avatarChangeAction,
		usernameChangeAction,
		joinedServerAction,
		leftServerAction
	)

	servicesManager.addService(discordService)
}
