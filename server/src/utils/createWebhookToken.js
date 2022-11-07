const jwt = require('jsonwebtoken')

module.exports = (webhookData) => {
    if (typeof webhookData !== 'object') {
        throw new Error('Invalid webhook data')
    }
    return jwt.sign(webhookData, process.env.JWT_SECRET, {}, null)
}
