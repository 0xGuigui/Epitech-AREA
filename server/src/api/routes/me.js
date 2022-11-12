const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose')
const {setOptions, checkId} = require('../middlewares/dynamic')
const {getUser, updateUser, deleteUser, updateUserPassword} = require("../controllers/users");
const {
    getUserActions,
    deleteUserActions,
    createUserAction,
    getUserAction,
    deleteUserAction
} = require("../controllers/actions");

module.exports = (area) => {
    const router = express.Router()
    const userActionRouter = express.Router({mergeParams: true})

    router.use(setOptions({userIdLocation: "jwt"}))
    router.route('/')
        .get(getUser)
        .put(updateUser)
        .delete(setOptions({areaInstance: area}), deleteUser)
    router.route('/actions')
        .get(getUserActions)
        .delete(deleteUserActions)
        .post(setOptions({areaInstance: area}), createUserAction)
    router
        .use('/actions/:actionId', userActionRouter)
        .post('/update-password', setOptions({areaInstance: area}), updateUserPassword)

    userActionRouter.use(checkId('actionId'))
    userActionRouter.route('/')
        .get(getUserAction)
        .delete(deleteUserAction)

    router.post('/actions/:actionId/execute', [checkId("actionId"), async (req, res) => {
        let action = await mongoose
            .model('Action')
            .findById(req.params.actionId)
            .exec()
        let {error, action: actionData} = await area.servicesManager.triggerAction(action)

        if (error) {
            return res.status(400).json({error: error})
        }
        return res.status(200).json({action: actionData})
    }])

    router.post('/actions/:actionId/retry', [checkId("actionId"), async (req, res) => {
        let action = await mongoose
            .model('Action')
            .findByIdAndUpdate(req.params.actionId, {$unset: {error: 1}}, {new: true})
            .exec()

        return res.status(200).json({action: action})
    }])

    area.app.use('/me', router)
}
