const express = require('express')
const mongoose = require('mongoose')

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

    area.app.use('/me', router)
}
