const mongoose = require('mongoose')
const {comparePassword, hashPassword} = require("../../utils/passwordHashing")
const {validatePayload} = require("../middlewares/dynamic")
const {updatePasswordSchema} = require("../models/joi/authSchemas")
const {checkAreaInstance} = require("../middlewares/others")

let purgeUser = (user) => {
    user.password = user.__v = undefined
    return user
}

module.exports.getUsers = async (req, res) => {
    let page = req.query.page > 1 ? req.query.page : 1
    let users = await mongoose
        .model("User")
        .find()
        .skip((page - 1) * 10)
        .limit(10)
        .exec()

    return res.json({
        users: users.map(user => {
            return purgeUser(user)
        })
    })
}

module.exports.searchUser = async (req, res) => {
    let searchParam = req.params.searchParam
    let orQuery = [
        {email: searchParam},
        {username: {$regex: searchParam, $options: 'i'}},
        ...(mongoose.Types.ObjectId.isValid(searchParam) ? [{_id: searchParam}] : []),
    ]
    let user = await mongoose
        .model("User")
        .findOne({
            $or: orQuery
        })
        .exec()
    if (!user) {
        return res.status(404).json({message: 'User not found'})
    }
    return res.json({user: purgeUser(user)})
}

module.exports.getUser = async (req, res) => {
    let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId
    let user = await mongoose
        .model("User")
        .findById(userId)
        .exec()

    if (!user) {
        return res.status(404).json({message: 'User not found'})
    }
    return res.json({user: purgeUser(user)})
}

module.exports.updateUser = async (req, res) => {
    let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId
    let updateQuery = {
        $set: {
            username: req.body.username,
            email: req.body.email,
            admin: req.body.admin,
            verified: req.body.verified,
        }
    }

    let user = await mongoose
        .model("User")
        .findByIdAndUpdate(userId, updateQuery, {new: true})
        .exec()

    if (!user) {
        return res.status(404).json({message: 'User not found'})
    }
    return res.json({user: purgeUser(user)})
}

module.exports.deleteUser = [checkAreaInstance, async (req, res) => {
    let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId
    let user = await mongoose
        .model("User")
        .findByIdAndRemove(userId)
        .exec()

    if (!user) {
        return res.status(404).json({message: 'User not found'})
    }
    await mongoose
        .model("Action")
        .deleteMany({userId: userId})
        .exec()
    req.areaInstance.jwtDenyList.addDeniedUser(user.id)
    return res.json({message: 'User deleted'})
}]

module.exports.updateUserPassword = [validatePayload(updatePasswordSchema), checkAreaInstance, async (req, res) => {
    let user = await mongoose
        .model("User")
        .findById(req.jwt.userId)
        .exec()

    if (!user) {
        throw new Error('User no longer exists')
    }
    let passwordMatch = await comparePassword(req.body.password, user.password)
    if (!passwordMatch) {
        return res.status(401).json({message: 'Invalid credentials'})
    }
    user.password = await hashPassword(req.body.newPassword)
    await user.save()
    req.areaInstance.jwtDenyList.addDeniedUser(user.id)
    return res.json({message: 'Password updated'})
}]
