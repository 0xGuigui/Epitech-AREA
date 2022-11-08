const mongoose = require('mongoose');
const logger = require('node-color-log')
const STATS_QUEUE_SIZE = 10;
const STATS_DOCUMENT_REF_ID = 1;

module.exports = class StatsManager {
    constructor() {
        this.stats = {
            servicesCount: 0,
            actionsCount: 0,
            usersCount: 0,
            api: {
                requestsCount: 0,
                codes: {}
            },
            db: {
                queriesCount: 0,
            },
        }
        this.openedRequests = []
    }

    async init(area) {
        logger.info('Booting up stats manager...')

        if (!await mongoose.models.Stats.findOne({}).exec()) {
            logger.info('Creating stats document...')
            let stats = new mongoose.models.Stats({
                _id: mongoose.Types.ObjectId(STATS_DOCUMENT_REF_ID),
                statsQueue: []
            })
            await stats.save()
        }
        await this.resetStats(area)
        this.setMongooseHookup()
        setInterval(async () => {
            let statsDocument = await mongoose.models.Stats.findOne({}).exec()
            let newEntry = {
                date: Date.now(),
                data: this.stats
            }

            if (statsDocument.statsQueue.length >= STATS_QUEUE_SIZE) {
                statsDocument.statsQueue.shift()
            }
            statsDocument.statsQueue.push(newEntry)
            await statsDocument.save()
            this.openedRequests.forEach(request => {
                request.write(`data: ${JSON.stringify(newEntry)}\n\n`)
            })
            await this.resetStats(area)
        }, 5000);
        logger.success('Stats manager successfully loaded')
    }

    async resetStats(area) {
        this.stats.usersCount = await mongoose.models.User.countDocuments()
        this.stats.actionsCount = await mongoose.models.Action.countDocuments()
        this.stats.servicesCount = area.servicesManager.getServices().length
        this.stats.api.codes = {}
        this.stats.api.requestsCount = 0
        this.stats.db.queriesCount = 0
    }

    setMongooseHookup() {
        mongoose.set('debug', () => {
            this.stats.db.queriesCount++
        })
    }

    addStats(statusCode) {
        this.stats.api.requestsCount++
        if (this.stats.api.codes[statusCode]) {
            this.stats.api.codes[statusCode]++
        } else {
            this.stats.api.codes[statusCode] = 1
        }
    }

    addOpenedRequest(response) {
        mongoose.models.Stats.findOne({}).exec().then(statsDocument => {
            statsDocument.statsQueue.forEach(entry => {
                response.write(`data: ${JSON.stringify(entry)}\n\n`)
            })
            this.openedRequests.push(response)
        })
    }

    removeOpenedRequest(response) {
        this.openedRequests = this.openedRequests.filter(r => r !== response)
    }
}
