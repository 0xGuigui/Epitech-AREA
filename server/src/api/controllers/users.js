const mongoose = require('mongoose')

let purge_user = (user) => {
    user.password = user.__v = undefined
    return user
}

module.exports.getUser = async (req, res) => {
    let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.param.userId
    let user = await mongoose
        .model("User")
        .findById(userId)
        .exec()

    if (!user) {
        return res.status(404).json({message: 'User not found'})
    }
    return res.json({user: purge_user(user)})
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
