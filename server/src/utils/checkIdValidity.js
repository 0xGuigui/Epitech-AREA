const ObjectId = require('mongoose').Types.ObjectId

let checkUserIdValidity = (req, res, next) => {
    if (!ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({message: 'Invalid user id'})
    }
    next()
}

let checkActionIdValidity = (req, res, next) => {
    if (!ObjectId.isValid(req.params.actionId)) {
        return res.status(400).json({message: 'Invalid action id'})
    }
    next()
}

module.exports = {
    checkUserIdValidity,
    checkActionIdValidity,
}
