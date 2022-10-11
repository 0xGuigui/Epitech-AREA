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
        this.cronJob = new cron.CronJob('*/15 * * * * *', async () => {
            let actionIds = await mongoose
                .model('Action')
                .find({"type.webhook": false})
                .distinct('_id')
                .exec();

            for (let actionId of actionIds) {
                let actionData = await mongoose
                    .model('Action')
                    .findById(actionId)
                    .exec();
                let action = this.getServiceAction(actionData.type.service, actionData.type.name);
                let reaction = this.getServiceReaction(actionData.reaction.type.service, actionData.reaction.type.name);

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

    getServiceAction(serviceName, actionName) {
        let service = this.getService(serviceName);

        if (service) {
            return service.actions.find(action => action.name === actionName);
        }
        return null;
    }

    getServiceReaction(serviceName, reactionName) {
        let service = this.getService(serviceName);

        if (service) {
            return service.reactions.find(reaction => reaction.name === reactionName);
        }
        return null;
    }
}
