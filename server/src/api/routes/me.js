const express = require('express')
const mongoose = require('mongoose')
const {validatePayload} = require('../middlewares/dynamic')
const {setOptions} = require('../middlewares/dynamic')
const {checkActionIdValidity} = require('../../utils/checkIdValidity')
const {comparePassword, hashPassword} = require("../../utils/passwordHashing");
const {updatePasswordSchema} = require("../models/joi/authSchemas");
const {createActionSchema} = require("../models/joi/actionSchemas");
const {getUser} = require("../controllers/users");

module.exports = (area) => {
    const router = express.Router()

    router.get('/', setOptions({userIdLocation: "jwt"}), getUser)

    router.route('/actions')
        .get(async (req, res) => {
            let actions = await mongoose
                .model("Action")
                .find({user: req.jwt.userId})
                .exec()

            res.json({actions: actions || []})
        })
        .post(validatePayload(createActionSchema), async (req, res) => {
            let {error, action} = await area.servicesManager.createAction(req.jwt.userId, req.body)

            if (error) {
                return res.status(400).json({error: error})
            }
            return res.status(201).json({action: action})
        })

    router.route('/actions/:actionId')
        .get(checkActionIdValidity, async (req, res) => {
            let action = await mongoose
                .model("Action")
                .findById(req.params.actionId)
                .exec()

            if (!action) {
                return res.status(404).json({message: 'Action not found'})
            }
            return res.json({action: action})
        })
        .put(checkActionIdValidity, (req, res) => {
            // TODO: Update action, we have to check every informations, delete the old action and create a new one
            res.send('Not implemented')
        })
        .delete(checkActionIdValidity, async (req, res) => {
            let action = await mongoose
                .model("Action")
                .findByIdAndRemove(req.params.actionId)
                .exec()

            if (!action) {
                return res.status(404).json({message: 'Action not found'})
            }
            return res.json({message: 'Action deleted'})
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

    router.post('/update-password', validatePayload(updatePasswordSchema), async (req, res) => {
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
