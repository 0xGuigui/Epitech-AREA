const mongoose = require('mongoose')
const {validatePayload} = require('../middlewares/dynamic')
const {createActionSchema} = require('../models/joi/actionSchemas')

let purgeAction = (action) => {
    action.__v = undefined
    return action
}

module.exports.getActions = async (req, res) => {
    let page = req.query.page > 1 ? req.query.page : 1
    let actions = await mongoose
        .model("Action")
        .find()
        .skip((page - 1) * 10)
        .limit(10)
        .exec()

    return res.json({
        actions: actions.map(action => {
            return purgeAction(action)
        })
    })
}

module.exports.getUserActions = async (req, res) => {
    let page = req.query.page > 1 ? req.query.page : 1
    let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId
    let actions = await mongoose
        .model("Action")
        .find({user: userId})
        .skip((page - 1) * 10)
        .limit(10)
        .exec()

    return res.json({
        actions: actions.map(action => {
            return purgeAction(action)
        })
    })
}

module.exports.deleteUserActions = async (req, res) => {
    let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId
    await mongoose
        .model("Action")
        .deleteMany({
            user: userId
        })
        .exec()

    return res.json({message: 'Actions deleted'})
}

module.exports.getUserAction = async (req, res) => {
    let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId
    let action = await mongoose
        .model("Action")
        .findOne({
            _id: req.params.actionId,
            user: userId
        })
        .exec()

    if (!action) {
        return res.status(404).json({message: 'Action not found'})
    }
    return res.json({action: purgeAction(action)})
}

module.exports.deleteUserAction = async (req, res) => {
    let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId
    let action = await mongoose
        .model("Action")
        .findOneAndDelete({
            _id: req.params.actionId,
            user: userId
        })
        .exec()

    if (!action) {
        return res.status(404).json({message: 'Action not found'})
    }
    return res.json({message: 'Action deleted'})
}

module.exports.createUserAction = [validatePayload(createActionSchema), async (req, res) => {
    // IMPORTANT: user needs to be added to the denied list
    if (!req.areaInstance) {
        console.error(`Missing areaInstance in req for action creation`)
        return res.status(500).json({message: 'Internal server error'})
    }
    let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId
    let {error, action} = await req.areaInstance.servicesManager.createAction(userId, req.body)

    if (error) {
        return res.status(400).json({error: error})
    }
    return res.status(201).json({action: purgeAction(action)})
}]
