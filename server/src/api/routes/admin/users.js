const express = require('express')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const {checkUserIdValidity, checkActionIdValidity} = require('../../../utils/checkIdValidity')

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
        let actions = await mongoose
            .model("Action")
            .find({
                $or: orQuery
            })
            .exec()
        res.json({actions: actions || []})
    })

    router.route('/:userId')
        .get(checkUserIdValidity, async (req, res) => {
            let user = await mongoose
                .model("User")
                .findById(req.params.userId)
                .exec()

            if (user) {
                return res.json({user: user})
            }
            return res.status(404).json({message: 'User not found'})
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

    router.get('/:userId/actions', checkUserIdValidity, async (req, res) => {
        let actions = await mongoose
            .model("Action")
            .find({user: req.params.userId})
            .exec()

        res.json({actions: actions})
    })

    router.route('/:userId/actions/:actionId')
        .get(checkUserIdValidity, checkActionIdValidity, (req, res) => {
            mongoose
                .model("Action")
                .findById(req.params.actionId)
                .exec()
                .then(action => {
                    if (!action) {
                        return res.status(404).json({message: 'Action not found'})
                    }
                    return res.status(200).json({action: action})
                })
                .catch(err => {
                    return res.status(500).json({message: err.message})
                })
        })
        .put(checkUserIdValidity, checkActionIdValidity, (req, res) => {
            // TODO: Update action, we have to check every informations, delete the old action and create a new one
            res.send('Not implemented')
        })
        .delete(checkUserIdValidity, checkActionIdValidity, (req, res) => {
            mongoose
                .model("Action")
                .findByIdAndRemove(req.params.actionId)
                .exec()
                .then(action => {
                    if (!action) {
                        return res.status(404).json({message: 'Action not found'})
                    }
                    res.status(200).json({message: 'Action deleted'})
                })
                .catch(err => {
                    res.status(500).json({message: err.message})
                })
        })

    area.app.use('/users', router)
}
