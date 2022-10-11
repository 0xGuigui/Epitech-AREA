const express = require('express')
const mongoose = require('mongoose')
const {createActionValidator} = require('../models/validationModels')
const payloadValidator = require('../../utils/payloadValidator')
const {checkActionIdValidity} = require('../../utils/checkIdValidity')

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
            let action = area.servicesManager.getServiceAction(req.body.actionServiceName, req.body.actionName)
            let reaction = area.servicesManager.getServiceReaction(req.body.reactionServiceName, req.body.reactionName)

            if (!action || !reaction) {
                return res.status(400).json({message: 'Invalid action configuration'})
            }
            // Check for action and reaction parameters and validate them, we assume that the action and reaction parameters are valid
            let actionData = {}
            let reactionData = {}
            try {
                actionData = action.onCreate ? await action.onCreate(req.body) : {}
                reactionData = reaction.onCreate ? await reaction.onCreate(req.body) : {}
            } catch (e) {
                return res.status(400).json({message: e.message})
            }
            let newActionName = req.body.name || `${action.name}-${reaction.name}`
            let newAction = new mongoose.models.Action({
                user: req.jwt.userId,
                actionName: newActionName,
                type: {
                    service: req.body.actionServiceName,
                    name: req.body.actionName,
                    webhook: action.webhook,
                },
                data: actionData,
                reaction: {
                    type: {
                        service: req.body.reactionServiceName,
                        name: req.body.reactionName,
                    },
                    data: reactionData,
                }
            })

            newAction.save().then(() => {
                return res.status(200).json({message: 'Action created'})
            }).catch(() => {
                return res.status(500).json({message: 'Internal server error'})
            })
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
