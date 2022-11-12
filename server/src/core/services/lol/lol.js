const {Service, Action, Reaction} = require("../serviceComponents");
const Joi = require("joi");

async function getRankById(id) {
	const response = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`, {
		headers: {
			"X-Riot-Token": process.env.RIOT_TOKEN
		}
	})

	return await response.json()
}

async function getAccountInfoByName(name) {
	const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`, {
		headers: {
			"X-Riot-Token": process.env.RIOT_TOKEN,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		mode: "cors"
	});

	return await response.json()
}

async function getAccountInfoByPuuid(puuid) {
	const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
		headers: {
			"X-Riot-Token": process.env.RIOT_TOKEN,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		mode: "cors"
	});

	return await response.json()
}

async function getMatchesIdByPuuid(puuid, offset, rankedOnly = false) {
	const response = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?${rankedOnly ? 'queue=420&' : ''}start=${offset}&count=20`, {
		headers: {
			"X-Riot-Token": process.env.RIOT_TOKEN,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
	return await response.json()
}

async function getMatchById(matchId) {
	const response = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
		headers: {
			"X-Riot-Token": process.env.RIOT_TOKEN,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
	return await response.json()
}

async function getLastMatch(summonerPuuid) {
	const matches = await getMatchesIdByPuuid(summonerPuuid, 0, false)
	return await getMatchById(matches[0])
}

async function getRotation() {
	const rotation = await fetch('https://euw1.api.riotgames.com/lol/platform/v3/champion-rotations', {
		headers: {
			"X-Riot-Token": process.env.RIOT_TOKEN,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		mode: "cors"
	})
	return await rotation.json()
}

module.exports = (area, servicesManager) => {
	const lolService = new Service('League', 'League of Legends', {
		mainColor: '#b88c3e',
		secondaryColor: '#044454',
		urlSite: 'https://euw.leagueoflegends.com/fr-fr/'
	})

	const levelUpAction = new Action('levelUp', 'when you level up in game')
		.on('create', async ctx => {
			const playerData = await getAccountInfoByName(ctx.payload["Summoner name"])
			ctx.setActionData('lol_puuid', playerData.puuid)
			ctx.setActionData('lol_level', playerData.summonerLevel)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const playerData = await getAccountInfoByPuuid(ctx.getActionData('lol_puuid'))
			if (playerData.summonerLevel !== ctx.getActionData('lol_level')) {
				ctx.setActionData('lol_level', playerData.summonerLevel)
				await ctx.next()
			}
		})
	const nameChangeAction = new Action('nameChange', 'when you change your name')
		.on('create', async ctx => {
			const playerData = await getAccountInfoByName(ctx.payload["Summoner name"])
			ctx.setActionData('lol_puuid', playerData.puuid)
			ctx.setActionData('lol_name', playerData.name)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const playerData = await getAccountInfoByPuuid(ctx.getActionData('lol_puuid'))
			if (playerData.name !== ctx.getActionData('lol_name')) {
				ctx.setActionData('lol_name', playerData.name)
				await ctx.next()
			}
		})
	const newGameAction = new Action('newGame', 'when you finish a new game')
		.on('create', async (ctx) => {
			const playerData = await getAccountInfoByName(ctx.payload["Summoner name"])
			const lastMatch = await getLastMatch(playerData.puuid)
			ctx.setActionData('lol_puuid', playerData.puuid)
			ctx.setActionData('lol_match_id', lastMatch.info.gameId)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const lastMatch = await getLastMatch(ctx.getActionData('lol_puuid'))
			if (lastMatch.info.gameId !== ctx.getActionData('lol_match_id')) {
				ctx.setActionData('lol_match_id', lastMatch.info.gameId)
				await ctx.next()
			}
		})
	const newRotationAction = new Action('newRotation', 'when new champions are available')
		.on('create', async ctx => {
			const rotationData = await getRotation()
			let rotation = ""
			rotationData.freeChampionIds.forEach(e => rotation += e.toString())
			ctx.setActionData('lol_rotation', rotation)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const rotationData = await getRotation()
			let rotation = ""
			rotationData.freeChampionIds.forEach(e => rotation += e.toString())
			if (rotation !== ctx.getActionData('lol_rotation')) {
				ctx.setActionData('lol_rotation', rotation)
				await ctx.next()
			}
		})

	const schema = Joi.object().keys({
		"Summoner name": Joi.string().required()
	}).unknown(true)

	levelUpAction.validationSchema = schema
	nameChangeAction.validationSchema = schema
	newGameAction.validationSchema = schema

	lolService.addAction(
		levelUpAction,
		nameChangeAction,
		newGameAction,
		newRotationAction
	)

	servicesManager.addService(lolService)
}
