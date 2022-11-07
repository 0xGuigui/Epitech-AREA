const mongoose = require('mongoose');
const logger = require('node-color-log')

module.exports = class StatsManager {
    constructor() {
        this.stats = {
            api: {},
            db: {},
        }
        this.openedRequests = []
    }

    async init() {
        logger.info('Booting up stats manager...')
        this.setMongooseHookup()
        this.stats.db.usersCount = await mongoose.models.User.countDocuments()
        this.stats.db.actionsCount = await mongoose.models.Action.countDocuments()
        logger.success('Stats manager successfully loaded')
    }

    setMongooseHookup() {
        mongoose.set('debug', () => {})
    }
}
