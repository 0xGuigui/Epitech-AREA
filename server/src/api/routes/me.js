const express = require('express')
const mongoose = require('mongoose')
const {createActionValidator} = require('../models/validationModels')
const payloadValidator = require('../../utils/payloadValidator')
const {checkActionIdValidity} = require('../../utils/checkIdValidity')
const {CreateActionContext} = require('../../core/services/actionContext')
const authValidators = require("../models/validationModels");
const {comparePassword, hashPassword} = require("../../utils/passwordHashing");

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
            let {error, action} = await area.servicesManager.createAction(req.jwt.userId, req.body)

            if (error) {
                return res.status(400).json({error: error})
            }
            return res.status(201).json({action: action})
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

    router.post('/actions/:actionId/execute', checkActionIdValidity, async (req, res) => {
        let action = await mongoose
            .model('Action')
            .findById(req.params.actionId)
            .exec()
        let {error, action: actionData} = await area.servicesManager.triggerAction(action)

        if (error) {
            return res.status(400).json({error: error})
        }
        return res.status(200).json({action: actionData})
    })

    router.post('/actions/:actionId/retry', checkActionIdValidity, async (req, res) => {
        let action = await mongoose
            .model('Action')
            .findByIdAndUpdate(req.params.actionId, {$unset: {error: 1}}, {new: true})
            .exec()

        return res.status(200).json({action: action})
    })

    router.post('/update-password', ...authValidators.updatePasswordValidator, payloadValidator, async (req, res) => {
        let user = await mongoose.models.User.findById(req.jwt.userId).exec()

        if (!user) {
            return res.status(500).json({message: 'User no longer exists'})
        }
        let passwordMatch = await comparePassword(req.body.password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({message: 'Invalid credentials'})
        }
        user.password = await hashPassword(req.body.newPassword)
        user.save().then(() => {
            area.jwtDenyList.addDeniedUser(user.id)
            return res.status(200).json({message: 'Password updated'})
        }).catch((err) => {
            return res.status(500).json({message: err.message})
        })
    })

    area.app.use('/me', router)
}
