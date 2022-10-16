const express = require('express')
const mongoose = require('mongoose')
const {createActionValidator} = require('../models/validationModels')
const payloadValidator = require('../../utils/payloadValidator')
const {checkActionIdValidity} = require('../../utils/checkIdValidity')
const createWebhookToken = require('../../utils/createWebhookToken')
const {CreateActionContext} = require('../../core/services/actionContext')

module.exports = (area) => {
    const router = express.Router()

    router.get('/', (req, res) => {
        let userId = req.jwt.userId

        mongoose.models.User.findById(userId).exec().then((user) => {
            if (user) {
                return res.json({
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        admin: user.admin,
                        createdAt: user.createdAt,
                    }
                })
            }
            return res.status(500).json({message: 'Internal server error'})
        })
    })

    router.route('/actions')
        .get(async (req, res) => {
            let page = req.query.page || 1

            if (page < 1) {
                page = 1
            }
            let actions = await mongoose
                .models.Action
                .find({user: req.jwt.userId})
                .skip((page - 1) * 10)
                .limit(10)
                .exec()

            res.json({actions: actions})
        })
        .post(...createActionValidator, payloadValidator, async (req, res) => {
            let action = area.servicesManager.getServiceAction(req.body.actionType)
            let reaction = area.servicesManager.getServiceReaction(req.body.reactionType)

            if (!action || !reaction) {
                return res.status(400).json({message: 'Invalid action configuration'})
            }
            // Check for action and reaction parameters and validate them, we assume that the action and reaction parameters are valid
            let newActionName = req.body.name || `${action.name}-${reaction.name}`
            let newAction = new mongoose.models.Action({
                user: req.jwt.userId,
                name: newActionName,
                actionType: req.body.actionType,
                webhook: action.webhook,
                reactionType: req.body.reactionType,
                data: {},
            })
            let ctx = new CreateActionContext(newAction, action, reaction)

            try {
                await ctx.next()
                return res.status(201).json({action: newAction})
            } catch (e) {
                return res.status(400).json({message: e.message})
            }
        })

    router.route('/actions/:actionId')
        .get(checkActionIdValidity, (req, res) => {
            mongoose.models.Action.findById(req.params.actionId).exec().then((action) => {
                if (action) {
                    return res.json({action: action})
                }
                return res.status(404).json({message: 'Action not found'})
            }).catch(() => {
                return res.status(500).json({message: 'Internal server error'})
            })
        })
        .put(checkActionIdValidity, (req, res) => {
            // TODO: Update action, we have to check every informations, delete the old action and create a new one
            res.send('Not implemented')
        })
        .delete(checkActionIdValidity, (req, res) => {
            mongoose.models.Action.findByIdAndDelete(req.params.actionId).exec().then((action) => {
                if (action) {
                    return res.json({message: 'Action deleted'})
                }
                return res.status(404).json({message: 'Action not found'})
            }).catch(() => {
                return res.status(500).json({message: 'Internal server error'})
            })
        })

    area.app.use('/me', router)
}
