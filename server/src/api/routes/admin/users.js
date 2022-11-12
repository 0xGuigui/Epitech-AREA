const express = require('express')
require('express-async-errors')
const {isAdmin} = require('../../middlewares/others')
const {checkId, setOptions} = require('../../middlewares/dynamic')
const {getUsers, getUser, updateUser, deleteUser} = require('../../controllers/users')
const {
    getUserActions,
    deleteUserActions,
    createUserAction,
    getUserAction,
    deleteUserAction
} = require("../../controllers/actions");
const mongoose = require("mongoose");

module.exports = (area) => {
    const router = express.Router()
    const userRouter = express.Router({mergeParams: true})
    const userActionRouter = express.Router({mergeParams: true})

    router
        .use(isAdmin)
        .get('/', getUsers)
        .use('/:userId', userRouter)

    userRouter
        .use(checkId('userId'), setOptions({userIdLocation: "params"}))
        .use('/actions/:actionId', userActionRouter)
    userRouter.route('/')
        .get(getUser)
        .put(updateUser)
        .delete(setOptions({areaInstance: area}), deleteUser)
    userRouter.route('/actions')
        .get(getUserActions)
        .delete(deleteUserActions)
        .post(setOptions({areaInstance: area}), createUserAction)
    userRouter.get('/logout', async (req, res) => {
        let user = await mongoose
            .model("User")
            .findById(req.params.userId)
            .exec()

        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }
        area.jwtDenyList.addDeniedUser(user.id)
        return res.json({message: 'User logged out'})
    })

    userActionRouter.use(checkId('actionId'))
    userActionRouter.route('/')
        .get(getUserAction)
        .delete(deleteUserAction)

    area.app.use('/users', router)
}
