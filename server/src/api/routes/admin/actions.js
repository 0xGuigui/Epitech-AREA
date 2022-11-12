const express = require("express")
require('express-async-errors')
const {isAdmin} = require("../../middlewares/others")
const {getActions, getAction, deleteAction} = require("../../controllers/actions")
const {checkId} = require("../../middlewares/dynamic");
const mongoose = require("mongoose");

module.exports = (area) => {
    const router = express.Router()
    const actionRouter = express.Router({mergeParams: true})

    router
        .use(isAdmin)
    router
        .use('/:actionId', actionRouter)
    router.route('/')
        .get(getActions)

    actionRouter.route('/')
        .get(getAction)
        .delete(deleteAction)

    actionRouter.post('/execute', async (req, res) => {
        let action = await mongoose
            .model('Action')
            .findByIdAndUpdate(req.params.actionId, {$unset: {error: 1}}, {new: true})
            .exec()
        let {error, action: actionData} = await area.servicesManager.triggerAction(action)

        if (error) {
            return res.status(400).json({error: error})
        }
        return res.status(200).json({action: actionData})
    })

    area.app.use('/actions', router)
}
