const express = require("express")
require('express-async-errors')
const {isAdmin} = require("../../middlewares/others")
const {getActions, getAction, deleteAction} = require("../../controllers/actions")

module.exports = (area) => {
    const router = express.Router()
    const actionRouter = express.Router({mergeParams: true})

    router
        .use(isAdmin)
    router
        .use('/:actionId', actionRouter)
    router.route('/')
        .get(getActions)

    actionRouter.route('/')
        .get(getAction)
        .delete(deleteAction)

    area.app.use('/actions', router)
}
