const {Service, Action, Reaction} = require('../serviceComponents')
const config = require("../../../../config")

async function getRefreshToken(code) {
	const response = await fetch(`https://www.reddit.com/api/v1/access_token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `basic ${Buffer.from(config.redditClientId + ':' + config.redditClientSecret).toString('base64')}`
		},
		body: `grant_type=authorization_code&code=${code}&redirect_uri=${config.redditRedirectUri}`
	})
	return await response.json()
}

async function getAccessToken(refresh_token) {
	const response = await fetch(`https://www.reddit.com/api/v1/access_token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `basic ${Buffer.from(config.redditClientId + ':' + config.redditClientSecret).toString('base64')}`
		},
		body: `grant_type=refresh_token&refresh_token=${refresh_token}`
	})
	return await response.json()
}

async function getMe(access_token) {
	const response = await fetch(`https://oauth.reddit.com/api/v1/me`, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `bearer ${access_token}`
		}
	})
	//snoovatar_img (onAvatarChange)
	return await response.json()
}

async function getUpvoted(access_token) {
	const me = await getMe(access_token)
	const response = await fetch(`https://oauth.reddit.com/user/${me.name}/upvoted`, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `bearer ${access_token}`
		}
	})
	// upvotedList.data.children[0].data.id (onNewUpvotedPost)
	return await response.json()
}

async function getDownvoted(access_token) {
	const me = await getMe(access_token)
	const response = await fetch(`https://oauth.reddit.com/user/${me.name}/downvoted`, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `bearer ${access_token}`
		}
	})
	// downvotedList.data.children[0].data.id (onNewDownvotedPost)
	return await response.json()
}

async function getSaved(access_token) {
	const me = await getMe(access_token)
	const response = await fetch(`https://oauth.reddit.com/user/${me.name}/saved`, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `bearer ${access_token}`
		}
	})
	// savedList.data.children[0].data.id (onSavedPost)
	return await response.json()
}

async function getComments(access_token) {
	const me = await getMe(access_token)
	const response = await fetch(`https://oauth.reddit.com/user/${me.name}/comments`, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `bearer ${access_token}`
		}
	})
	// savedList.data.children[0].data.id (onNewComment)
	return await response.json()
}

async function getPosts(access_token) {
	const me = await getMe(access_token)
	const response = await fetch(`https://oauth.reddit.com/user/${me.name}/submitted`, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `bearer ${access_token}`
		}
	})
	// savedList.data.children[0].data.id (onNewPost)
	return await response.json()
}

async function readAllMessages(access_token) {
	await fetch(`https://oauth.reddit.com/api/read_all_messages`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `bearer ${access_token}`
		}
	})
}

module.exports = (area, servicesManager) => {
	const redditService = new Service('Reddit', 'Reddit - Dive into anything')

	const avatarChangeAction = new Action('avatarChange', 'when you change your avatar')
		.on('create', async ctx => {
			const refreshTokenData = await getRefreshToken(ctx.payload.reddit_code)
			const me = await getMe(refreshTokenData.access_token)
			ctx.setActionData('reddit_refresh_token', refreshTokenData.refresh_token)
			ctx.setActionData('reddit_snoovatar_img', me.snoovatar_img)
			await ctx.next({
				'reddit_refresh_token': refreshTokenData.refresh_token
			})
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.getActionData('reddit_refresh_token'))
			const me = await getMe(accessTokenData.access_token)
			if (me.snoovatar_img !== ctx.getActionData('reddit_snoovatar_img')) {
				ctx.setActionData('reddit_snoovatar_img', me.snoovatar_img)
				await ctx.next()
			}
		})
	const newUpvoteAction = new Action('newUpvote', 'new upvoted message by you')
		.on('create', async ctx => {
			const refreshTokenData = await getRefreshToken(ctx.payload.reddit_code)
			const upvotedListData = await getUpvoted(refreshTokenData.access_token)
			ctx.setActionData('reddit_refresh_token', refreshTokenData.refresh_token)
			ctx.setActionData('reddit_last_upvoted', upvotedListData.data.children[0].data.id)
			await ctx.next({
				'reddit_refresh_token': refreshTokenData.refresh_token
			})
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.getActionData('reddit_refresh_token'))
			const upvotedListData = await getUpvoted(accessTokenData.access_token)
			if (upvotedListData.data.children[0].data.id !== ctx.getActionData('reddit_last_upvoted')) {
				ctx.setActionData('reddit_last_upvoted', upvotedListData.data.children[0].data.id)
				await ctx.next()
			}
		})
	const newDownvoteAction = new Action('newDownvote', 'new downvoted message by you')
		.on('create', async ctx => {
			const refreshTokenData = await getRefreshToken(ctx.payload.reddit_code)
			const downvotedListData = await getDownvoted(refreshTokenData.access_token)
			ctx.setActionData('reddit_refresh_token', refreshTokenData.refresh_token)
			ctx.setActionData('reddit_last_downvoted', downvotedListData.data.children[0].data.id)
			await ctx.next({
				'reddit_refresh_token': refreshTokenData.refresh_token
			})
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.getActionData('reddit_refresh_token'))
			const downvotedListData = await getDownvoted(accessTokenData.access_token)
			if (downvotedListData.data.children[0].data.id !== ctx.getActionData('reddit_last_downvoted')) {
				ctx.setActionData('reddit_last_downvoted', downvotedListData.data.children[0].data.id)
				await ctx.next()
			}
		})
	const newSavedAction = new Action('newSaved', 'new saved message by you')
		.on('create', async ctx => {
			const refreshTokenData = await getRefreshToken(ctx.payload.reddit_code)
			const savedListData = await getSaved(refreshTokenData.access_token)
			ctx.setActionData('reddit_refresh_token', refreshTokenData.refresh_token)
			ctx.setActionData('reddit_last_saved', savedListData.data.children[0].data.id)
			await ctx.next({
				'reddit_refresh_token': refreshTokenData.refresh_token
			})
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.getActionData('reddit_refresh_token'))
			const savedListData = await getComments(accessTokenData.access_token)
			if (savedListData.data.children[0].data.id !== ctx.getActionData('reddit_last_saved')) {
				ctx.setActionData('reddit_last_saved', savedListData.data.children[0].data.id)
				await ctx.next()
			}
		})
	const newCommentAction = new Action('newSaved', 'new comment by you')
		.on('create', async ctx => {
			const refreshTokenData = await getRefreshToken(ctx.payload.reddit_code)
			const commentListData = await getComments(refreshTokenData.access_token)
			ctx.setActionData('reddit_refresh_token', refreshTokenData.refresh_token)
			ctx.setActionData('reddit_last_comment', commentListData.data.children[0].data.id)
			await ctx.next({
				'reddit_refresh_token': refreshTokenData.refresh_token
			})
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.getActionData('reddit_refresh_token'))
			const commentListData = await getComments(accessTokenData.access_token)
			if (commentListData.data.children[0].data.id !== ctx.getActionData('reddit_last_comment')) {
				ctx.setActionData('reddit_last_comment', commentListData.data.children[0].data.id)
				await ctx.next()
			}
		})
	const newPostAction = new Action('newSaved', 'new post by you')
		.on('create', async ctx => {
			const refreshTokenData = await getRefreshToken(ctx.payload.reddit_code)
			const postListData = await getPosts(refreshTokenData.access_token)
			ctx.setActionData('reddit_refresh_token', refreshTokenData.refresh_token)
			ctx.setActionData('reddit_last_post', postListData.data.children[0].data.id)
			await ctx.next({
				'reddit_refresh_token': refreshTokenData.refresh_token
			})
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.getActionData('reddit_refresh_token'))
			const postListData = await getPosts(accessTokenData.access_token)
			if (postListData.data.children[0].data.id !== ctx.getActionData('reddit_last_post')) {
				ctx.setActionData('reddit_last_post', postListData.data.children[0].data.id)
				await ctx.next()
			}
		})

	const readMessagesReaction = new Reaction('readMessages', 'marks all your messages as read')
		.on('create', async ctx => {
			if (!ctx.env.reddit_refresh_token) {
				const refreshTokenData = await getRefreshToken(ctx.payload.reddit_code)

				ctx.setActionData('reddit_refresh_token', refreshTokenData.refresh_token)
			}
			await ctx.next()
		})
		.on('trigger', async ctx => {
			const accessTokenData = await getAccessToken(ctx.getActionData('reddit_refresh_token'))
			await readAllMessages(accessTokenData.access_token)
			await ctx.next()
		})

	redditService.addAction(
		avatarChangeAction,
		newUpvoteAction,
		newDownvoteAction,
		newSavedAction,
		newCommentAction,
		newPostAction
	)

	redditService.addReaction(readMessagesReaction)

	servicesManager.addService(redditService)
}