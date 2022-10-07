const cron = require('cron');

module.exports = class JwtDenyList {
    jwtDenyList = []
    cronJob = undefined

    constructor(cronTime = '* */15 * * * *') {
        // Use bind to keep the context of the class
        this.cronJob = new cron.CronJob(cronTime, this.purgeDenyList.bind(this), null, true, 'Europe/Paris');
    }

    addDeniedUser(userId) {
        this.jwtDenyList.push([userId, Date.now() / 1000])
    }

    isTokenDenied(userId, tokenIssuedAt) {
        return this.jwtDenyList.some((denyRule) => {
            return denyRule[0] === userId && tokenIssuedAt <= denyRule[1]
        })
    }

    purgeDenyList() {
        let now = Date.now() / 1000
        let expirationTime = 60 * 60 * 3 // 3 hours, you must have the same value has the refresh token expiration time

        this.jwtDenyList = this.jwtDenyList.filter((denyRule) => {
            return denyRule[1] + expirationTime > now
        })
    }
}
