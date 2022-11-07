const {Service, Action, Reaction} = require("../serviceComponents");

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
	const lolService = new Service('League of Legends', 'League of Legends')

	const levelUpAction = new Action('levelUp', 'when you level up in game')
		.on('create', async ctx => {
			const playerData = await getAccountInfoByName(ctx.payload.summonerName)
			ctx.setActionData('lol_puuid', playerData.puuid)
			ctx.setActionData('lol_level', playerData.level)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const playerData = await getAccountInfoByPuuid(ctx.getActionData('lol_puuid'))
			if (playerData.level !== ctx.getActionData('lol_level')) {
				ctx.setActionData('lol_level', playerData.level)
				await ctx.next()
			}
		})
	const nameChangeAction = new Action('nameChange', 'when you change your name')
		.on('create', async ctx => {
			const playerData = await getAccountInfoByName(ctx.payload.summonerName)
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
	const rankChangeAction = new Action('rankChange', 'when you go up or down a rank/division')
		.on('create', async ctx => {
			const playerData = await getAccountInfoByName(ctx.payload.summonerName)
			const rankData = await getRankById(playerData.id)
			const rank = rankData.find(e => e.queueType === ctx.playload.queueType)
			ctx.setActionData('lol_id', playerData.id)
			ctx.setActionData('lol_queue_type', ctx.payload.queueType)
			ctx.setActionData('lol_rank', rank.rank)
			ctx.setActionData('lol_tier', rank.tier)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const rankData = await getRankById(ctx.getActionData('lol_id'))
			const rank = rankData.find(e => e.queueType === ctx.getActionData('lol_queue_type'))
			if (rank.rank !== ctx.getActionData('lol_rank') || rank.tier !== ctx.getActionData('lol_tier')) {
				ctx.setActionData('lol_rank', rank.rank)
				ctx.setActionData('lol_tier', rank.tier)
				await ctx.next()
			}
		})
	const newGameAction = new Action('newGame', 'when you finish a new game')
		.on('create', async (ctx) => {
			const playerData = await getAccountInfoByName(ctx.payload.summonerName)
			const lastMatch = await getLastMatch(playerData.puuid)
			ctx.setActionData('lol_puuid', playerData.puuid)
			ctx.setActionData('lol_match_id', lastMatch.matchId)
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const lastMatch = await getLastMatch(ctx.getActionData('lol_puuid'))
			if (lastMatch.matchId !== ctx.getActionData('lol_match_id')) {
				ctx.setActionData('lol_match_id', lastMatch.matchId)
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

	lolService.addAction(
		levelUpAction,
		nameChangeAction,
		rankChangeAction,
		newGameAction,
		newRotationAction
	)

	servicesManager.addService(lolService)
}