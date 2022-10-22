const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const {validatePayload} = require('../middlewares/dynamic')
const {createActionSchema} = require('../models/joi/actionSchemas')
const {checkAreaInstance} = require("../middlewares/others");

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

module.exports.getAction = async (req, res) => {
    let action = await mongoose
        .model("Action")
        .findOne({
            _id: req.params.actionId
        })
        .exec()

    if (!action) {
        return res.status(404).json({message: 'Action not found'})
    }
    return res.json({action: purgeAction(action)})
}

module.exports.deleteAction = async (req, res) => {
    let action = await mongoose
        .model("Action")
        .findOneAndDelete({
            _id: req.params.actionId
        })
        .exec()

    if (!action) {
        return res.status(404).json({message: 'Action not found'})
    }
    return res.json({message: 'Action deleted'})
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

module.exports.createUserAction = [validatePayload(createActionSchema), checkAreaInstance, async (req, res) => {
    let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId
    let {error, action} = await req.areaInstance.servicesManager.createAction(userId, req.body)

    if (error) {
        return res.status(400).json({error: error})
    }
    return res.status(201).json({action: purgeAction(action)})
}]

module.exports.searchAction = async (req, res) => {
    let searchParam = req.params.searchParam
    let orQuery = [
        {actionType: searchParam},
        {reactionType: searchParam},
        ...(ObjectId.isValid(searchParam) ? [{user: searchParam}] : []),
        ...(ObjectId.isValid(searchParam) ? [{_id: searchParam}] : []),
    ]
    let actions = await mongoose
        .model("Action")
        .find({
            $or: orQuery
        })
        .exec()

    return res.json({
        actions: actions.map(action => {
            return purgeAction(action)
        })
    })
}
