const pathBuilder = require("path");
const cron = require("cron");
const fs = require("fs");
const mongoose = require("mongoose");

module.exports = class ServicesManager {
    constructor(area) {
        this.services = [];

        fs.readdirSync(__dirname).forEach(file => {
            let filePath = pathBuilder.join(__dirname, file);
            let stat = fs.statSync(filePath);

            if (stat && stat.isDirectory()) {
                let fileContent = require(pathBuilder.join(filePath, file + '.js'));

                if (typeof fileContent === 'function') {
                    fileContent(area, this);
                }
            }
        })

        // Start cron job to update all non-webhook actions
        this.cronJob = new cron.CronJob('*/10 * * * * *', async () => {
            let actionIds = await mongoose
                .model('Action')
                .find({webhook: false})
                .distinct('_id')
                .exec();

            for (let actionId of actionIds) {
                let actionData = await mongoose
                    .model('Action')
                    .findById(actionId)
                    .exec();
                let action = this.getServiceAction(actionData.type);
                let reaction = this.getServiceReaction(actionData.reaction.type);

                if (action.onTrigger) {
                    // It might crash here if multiple services are using the same name
                    action.onTrigger(actionData, reaction);
                }
            }
        }, null, true, 'Europe/Paris');
    }

    addService(service) {
        this.services.push(service);
    }

    getService(serviceName) {
        return this.services.find(service => service.name === serviceName);
    }

    getServiceAction(actionName) {
        let split = actionName.split('/');
        let service = this.getService(split[0]);

        if (service) {
            return service.actions.find(action => action.name === split[1]);
        }
        return null;
    }

    getServiceReaction(reactionName) {
        let split = reactionName.split('/');
        let service = this.getService(split[0]);

        if (service) {
            return service.reactions.find(reaction => reaction.name === split[1]);
        }
        return null;
    }

    async createAction(payload) {
        console.log("createAction");
    }

    async triggerAction() {
        console.log("triggerAction");
    }
}
