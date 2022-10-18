const pathBuilder = require("path");
const cron = require("cron");
const fs = require("fs");
const mongoose = require("mongoose");
const {TriggerActionContext, CreateActionContext} = require('./actionContext')

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
                .find({webhook: false, error: null})
                .distinct('_id')
                .exec();

            for (let actionId of actionIds) {
                let actionData = await mongoose
                    .model('Action')
                    .findById(actionId)
                    .exec();
                this.triggerAction(actionData);
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

    async createAction(userId, payload) {
        let action = this.getServiceAction(payload.actionType);
        let reaction = this.getServiceReaction(payload.reactionType);

        if (!action || !reaction) {
            return { action: null, error: 'Invalid action or reaction' };
        }
        if (action.validationSchema?.validate(payload).error || reaction.validationSchema?.validate(payload).error) {
            return { action: null, error: 'Invalid payload' };
        }
        let newAction = new mongoose.models.Action({
            user: userId,
            name: payload.name || `${action.name}-${reaction.name}`,
            actionType: payload.actionType,
            webhook: action.webhook,
            reactionType: payload.reactionType,
            data: {},
        })
        let ctx = new CreateActionContext(newAction, payload, action, reaction)

        try {
            await ctx.next()
            return {action: ctx.actionData, error: null};
        } catch (e) {
            return {action: null, error: e.message};
        }
    }

    async triggerAction(actionData) {
        let action = this.getServiceAction(actionData.actionType);
        let reaction = this.getServiceReaction(actionData.reactionType);
        let ctx = new TriggerActionContext(actionData, action, reaction);

        try {
            await ctx.next()
            return {action: ctx.actionData, error: null};
        } catch (e) {
            ctx.actionData.error = e.message;
            await ctx.actionData.save();
            return {error: e.message};
        }
    }
}
