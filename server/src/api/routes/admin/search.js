const express = require('express')
require('express-async-errors')
const {searchUser} = require("../../controllers/users")
const {searchAction} = require("../../controllers/actions")
const {isAdmin} = require("../../middlewares/others")

module.exports = (area) => {
    const router = express.Router()

    router
        .use(isAdmin)
        .get('/actions/:searchParam', searchAction)
        .get('/users/:searchParam', searchUser)

    area.app.use('/search', router)
}
