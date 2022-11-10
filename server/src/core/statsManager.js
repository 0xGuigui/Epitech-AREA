const mongoose = require('mongoose');
const logger = require('node-color-log')
const STATS_QUEUE_SIZE = 10;
const STATS_DOCUMENT_REF_ID = 1;
const writingMethods = ['insert', 'update', 'remove', 'delete', 'createIndex', 'updateOne']

function resetStatsFactory() {
    return {
        actionsCount: 0,
        usersCount: 0,
        servicesCount: 0,
        servicesData: {},
        api: {
            total: 0,
            "4XX": 0,
            "5XX": 0
        },
        db: {
            total: 0,
            "write": 0,
            "read": 0
        },
    }
}

module.exports = class StatsManager {
    constructor() {
        this.stats = resetStatsFactory()
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
                date: new Date(),
                data: this.stats
            }

            if (statsDocument.statsQueue.length >= STATS_QUEUE_SIZE) {
                statsDocument.statsQueue.shift()
            }
            statsDocument.statsQueue.push(newEntry)
            await statsDocument.save()
            this.openedRequests.forEach(request => {
                request.write(`data: ${JSON.stringify([newEntry])}\n\n`)
            })
            await this.resetStats(area)
        }, 5000);
        logger.success('Stats manager successfully loaded')
    }

    async resetStats(area) {
        this.stats = resetStatsFactory()
        this.stats.actionsCount = await mongoose.models.Action.countDocuments({}).exec()
        this.stats.usersCount = await mongoose.models.User.countDocuments({}).exec()
        this.stats.servicesCount = area.servicesManager.getServices().length
        this.stats.servicesData = area.servicesManager.getServicesData()
    }

    setMongooseHookup() {
        mongoose.set('debug', (collectionName, method, query, doc) => {
            this.stats.db.total++
            if (writingMethods.includes(method)) {
                this.stats.db.write++
            } else {
                this.stats.db.read++
            }
        })
    }

    addStats(statusCode) {
        this.stats.api.total++
        if (statusCode >= 400 && statusCode < 500) {
            this.stats.api["4XX"]++
        } else if (statusCode >= 500) {
            this.stats.api["5XX"]++
        }
    }

    addOpenedRequest(response) {
        mongoose.models.Stats.findOne({}).exec().then(statsDocument => {
            response.write(`data: ${JSON.stringify(statsDocument.statsQueue)}\n\n`)
            this.openedRequests.push(response)
        })
    }

    removeOpenedRequest(response) {
        this.openedRequests = this.openedRequests.filter(r => r !== response)
    }
}
