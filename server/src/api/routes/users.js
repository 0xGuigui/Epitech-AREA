const express = require('express')
const mongoose = require('mongoose')
const {checkUserIdValidity} = require('../../utils/checkIdValidity')

module.exports = (area) => {
    const router = express.Router()

    router.use((req, res, next) => {
        if (!req.jwt.admin) {
            return res.status(401).json({message: 'Unauthorized'})
        }
        next()
    })

    router.get('/', async (req, res) => {
        let page = req.query.page || 1

        if (page < 1) {
            page = 1
        }
        let users = await mongoose
            .model("User")
            .find()
            .skip((page - 1) * 10)
            .limit(10)
            .exec()

        res.json({users: users})
    })

    router.get('/search/:searchParam', async (req, res) => {
        let searchParam = req.params.searchParam
        let orQuery = [
            {email: searchParam},
            {username: searchParam},
            ...(ObjectId.isValid(searchParam) ? [{_id: searchParam}] : []),
        ]

        mongoose
            .model("User")
            .findOne({
                $or: orQuery
            })
            .exec()
            .then((user) => {
                if (user) {
                    return res.json({user: user})
                }
                return res.status(404).json({message: 'User not found'})
            })
            .catch((err) => {
                res.status(500).json({message: err.message})
            })
    })

    router.route('/:userId')
        .get(checkUserIdValidity, (req, res) => {
            mongoose
                .model("User")
                .findById(req.params.userId)
                .exec()
                .then(user => {
                    if (!user) {
                        return res.status(404).json({message: 'User not found'})
                    }
                    res.json({user: user})
                })
                .catch(err => {
                    res.status(500).json({message: err.message})
                })
        })
        .put(checkUserIdValidity, (req, res) => {
            let updateQuery = {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    admin: req.body.admin,
                    verified: req.body.verified,
                }
            }

            mongoose
                .model("User")
                .findByIdAndUpdate(req.params.userId, updateQuery, {new: true})
                .exec()
                .then(user => {
                    if (!user) {
                        return res.status(404).json({message: 'User not found'})
                    }
                    area.jwtDenyList.addDeniedUser(req.params.userId)

                    return res.json({user: user})
                })
                .catch(err => {
                    return res.status(500).json({message: err.message})
                })
        })
        .delete(checkUserIdValidity, (req, res) => {
            mongoose
                .model("User")
                .findByIdAndRemove(req.params.userId)
                .exec()
                .then(user => {
                    if (!user) {
                        return res.status(404).json({message: 'User not found'})
                    }
                    area.jwtDenyList.addDeniedUser(req.params.userId)

                    res.status(200).json({message: 'User deleted'})
                })
                .catch(err => {
                    res.status(500).json({message: err.message})
                })
        })

    area.app.use('/users', router)
}
