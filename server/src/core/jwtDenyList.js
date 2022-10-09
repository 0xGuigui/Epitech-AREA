const cron = require('cron');

module.exports = class JwtDenyList {
    jwtDenyList = []
    jwtGlobalDenyRule = null
    cronJob = null

    constructor(cronTime = '* */15 * * * *') {
        // Use bind to keep the context of the class
        this.cronJob = new cron.CronJob(cronTime, this.purgeDenyList.bind(this), null, true, 'Europe/Paris');
    }

    addDeniedUser(userId) {
        this.jwtDenyList.push([userId, Date.now() / 1000])
    }

    addGlobalDenyRule() {
        this.jwtGlobalDenyRule = Date.now() / 1000
    }

    isTokenDenied(userId, tokenIssuedAt) {
        if (this.jwtGlobalDenyRule) {
            return tokenIssuedAt <= this.jwtGlobalDenyRule
        }
        return this.jwtDenyList.some((denyRule) => {
            return denyRule[0] === userId && tokenIssuedAt <= denyRule[1]
        })
    }

    purgeDenyList() {
        let now = Date.now() / 1000
        let expirationTime = 60 * 60 * 3 // 3 hours, you must have the same value has the refresh token expiration time

        if (this.jwtGlobalDenyRule && this.jwtGlobalDenyRule + expirationTime <= now) {
            this.jwtGlobalDenyRule = null
        }
        this.jwtDenyList = this.jwtDenyList.filter((denyRule) => {
            return denyRule[1] + expirationTime > now
        })
    }
}
