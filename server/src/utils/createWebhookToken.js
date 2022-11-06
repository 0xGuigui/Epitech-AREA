const jwt = require('jsonwebtoken')
const config = require('../../config')

module.exports = (webhookData) => {
    if (typeof webhookData !== 'object') {
        throw new Error('Invalid webhook data')
    }
    return jwt.sign(webhookData, config.jwtSecret, {}, null)
}
