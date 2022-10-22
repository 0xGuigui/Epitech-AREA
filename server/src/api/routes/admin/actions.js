const {isAdmin} = require("../../middlewares/others");
const express = require("express");
const {getActions, getAction, deleteAction} = require("../../controllers/actions");

module.exports = (area) => {
    const router = express.Router()
    const actionRouter = express.Router({mergeParams: true})

    router
        .use(isAdmin)
    router.route('/')
        .get(getActions)
    router
        .use('/:actionId', actionRouter)

    actionRouter.route('/')
        .get(getAction)
        .delete(deleteAction)

    area.app.use('/actions', router)
}
