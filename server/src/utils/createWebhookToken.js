const jwt = require('jsonwebtoken')

function createWebhookToken(payload) {
    if (typeof payload !== 'object') {
        throw new Error('Invalid webhook data')
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {}, null)
}

function createActionWebhook(areaInstance, ctx, data = {}) {
    let jwtData = {
        actionId: ctx.actionData._id,
    }

    Object.entries(data).forEach(([key, value]) => {
        jwtData[key] = value
    })
    let webhookToken = createWebhookToken(jwtData)
    ctx.actionData.webhookUrl = `/webhook/${webhookToken}`
    ctx.dirty()
}

module.exports = {
    createWebhookToken,
    createActionWebhook,
}
