const {Service, Action} = require('../serviceComponents')
const Joi = require("joi");

async function getId(profileUrl) {
	const profileId = profileUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:steamcommunity.com\/(?:profiles|id)\/)([a-zA-Z0-9]+)/)
	const response = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_TOKEN}&vanityurl=${profileId[1]}`)
	const json = await response.json()
	return json.response.steamid
}

async function getAllGames() {
	const response = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
	return await response.json()
}

async function getGameByName(name) {
	const games = await getAllGames()
	name = name.toLowerCase()
	return games.applist.apps.find(e => e.name.toLowerCase() === name)
}

async function getGameNews(appId) {
	const response = await fetch(`http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${appId}&count=1&format=json`)
	return await response.json()
}

async function getUserStatsByGame(steamId, appId) {
	const response = await fetch(`http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${appId}&key=${process.env.STEAM_TOKEN}&steamid=${steamId}`)
	return await response.json()
}

async function getOwnedGames(steamId) {
	const response = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_TOKEN}&steamid=${steamId}`)
	const json = await response.json()
	return json.response
}

module.exports = (area, servicesManager) => {
	const steamService = new Service('Steam', 'Steam', {
		mainColor: '#7ca1bd',
		secondaryColor: '#102553'
	})

	const newGameNewsAction = new Action('newGameNews', 'when a game gets a news')
		.on('create', async ctx => {
			const game = await getGameByName(ctx.payload["Game name"])
			const news = await getGameNews(game.appid)
			ctx.setActionData('steam_news_id', news.appnews.newsitems[0].gid)
			ctx.setActionData('steam_app_id', game.appid)
		})
		.on('trigger', async ctx => {
			const news = await getGameNews(ctx.getActionData('steam_app_id'))
			if (news.appnews.newsitems[0].gid !== ctx.getActionData('steam_news_id')) {
				ctx.setActionData('steam_news_id', news.appnews.newsitems[0].gid)
				await ctx.next()
			}
		})
	const newAchievementAction = new Action('newAchievement', 'new achievement on a game')
		.on('create', async ctx => {
			const game = await getGameByName(ctx.payload["Game name"])
			const steamId = await getId(ctx.payload["Profile url"])
			const stats = await getUserStatsByGame(steamId, game.appid)
			ctx.setActionData('steam_app_id', game.appid)
			ctx.setActionData('steam_id', steamId)
			ctx.setActionData('steam_achievement_length', stats.playerstats.achievements.length)
		})
		.on('trigger', async ctx => {
			const stats = await getUserStatsByGame(ctx.getActionData('steam_id'), ctx.getActionData('steam_app_id'))
			if (stats.playerstats.achievements.length !== ctx.getActionData('steam_achievement_length')) {
				ctx.setActionData('steam_achievement_length', stats.playerstats.achievements.length)
				await ctx.next()
			}
		})
	const newOwnedGameAction = new Action('newOwnedGame', 'new owned game')
		.on('create', async ctx => {
			const steamId = await getId(ctx.payload["Profile url"])
			const ownedGames = await getOwnedGames(steamId)
			ctx.setActionData('steam_id', steamId)
			ctx.setActionData('steam_game_count', ownedGames.game_count)
		})
		.on('trigger', async ctx => {
			const ownedGames = await getOwnedGames(ctx.getActionData('steam_id'))
			if (ownedGames.game_count !== ctx.getActionData('steam_game_count')) {
				ctx.setActionData('steam_game_count', ownedGames.game_count)
				await ctx.next()
			}
		})

	newGameNewsAction.validationSchema = Joi.object().keys({
		"Game name": Joi.string().required()
	}).unknown(true)

	newAchievementAction.validationSchema = Joi.object().keys({
		"Game name": Joi.string().required(),
		"Profile url": Joi.string().required()
	}).unknown(true)

	newOwnedGameAction.validationSchema = Joi.object().keys({
		"Profile url": Joi.string().required()
	}).unknown(true)

	steamService.addAction(
		newGameNewsAction,
		newAchievementAction,
		newOwnedGameAction
	)

	servicesManager.addService(steamService)
}
