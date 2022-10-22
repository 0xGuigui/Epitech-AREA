const mongoose = require('mongoose')

let purge_user = (user) => {
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
            return purge_user(user)
        })
    })
}

module.exports.searchUser = async (req, res) => {
    let searchParam = req.params.searchParam
    let orQuery = [
        {email: searchParam},
        {username: searchParam},
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
    return res.json({user: purge_user(user)})
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
    return res.json({user: purge_user(user)})
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
    return res.json({user: purge_user(user)})
}

module.exports.deleteUser = async (req, res) => {
    // IMPORTANT: user needs to be added to the denied list
    if (!req.areaInstance) {
        console.error(`Missing areaInstance in req for user deletion`)
        return res.status(500).json({message: 'Internal server error'})
    }

    let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId
    let user = await mongoose
        .model("User")
        .findByIdAndRemove(userId)
        .exec()

    if (!user) {
        return res.status(404).json({message: 'User not found'})
    }
    req.areaInstance.jwtDenyList.addDeniedUser(user.id)
    return res.json({message: 'User deleted'})
}
