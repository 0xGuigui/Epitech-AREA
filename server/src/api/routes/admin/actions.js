const express = require('express');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

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
        let actions = await mongoose
            .model("Action")
            .find()
            .skip((page - 1) * 10)
            .limit(10)
            .exec()
        res.json({actions: actions})
    })

    router.get('/search/:searchParam', async (req, res) => {
        let searchParam = req.params.searchParam
        let orQuery = [
            ...(ObjectId.isValid(searchParam) ? [{user: searchParam}] : []),
            ...(ObjectId.isValid(searchParam) ? [{_id: searchParam}] : []),
        ]

        mongoose
            .model("Action")
            .findOne({
                $or: orQuery
            })
            .exec()
            .then((action) => {
                if (action) {
                    return res.json({action: action})
                }
                return res.status(404).json({message: 'User not found'})
            })
            .catch((err) => {
                res.status(500).json({message: err.message})
            })
    })

    router.route('/:actionId')
        .get(async (req, res) => {
            let action = await mongoose
                .model("Action")
                .findById(req.params.actionId)
                .exec()

            if (!action) {
                return res.status(404).json({message: 'Action not found'})
            }
            return res.json({action: action})
        })
        .put(async (req, res) => {
            // TODO: Update action, we have to check every informations, delete the old action and create a new one
            res.send('Not implemented')
        })
        .delete(async (req, res) => {
            let action = await mongoose
                .model("Action")
                .findByIdAndDelete(req.params.actionId)
                .exec()

            if (!action) {
                return res.status(404).json({message: 'Action not found'})
            }
            return res.json({action: action})
        })

    area.app.use('/actions', router)
}
