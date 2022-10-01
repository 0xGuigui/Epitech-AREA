const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const config = require('./config')
const {expressDynamicLoader} = require('./utils/dynamicLoader')
const {loadServices} = require('./services/servicesHandler')

class AREA {
    constructor() {
        this.app = express()
        this.config = config
        this.dbConnection = null
        this.services = []
        this.jwtDenyList = []
        this.unprotectedRoutes = ["login", "refresh", "register", "reset-password", "about.json"]

        // Check for required fields in the config
        this.checkConfig()

        // Load all services
        loadServices(this)

        // Load all middlewares and routes
        expressDynamicLoader(this, path.join(__dirname, 'middlewares'))
        expressDynamicLoader(this, path.join(__dirname, 'routes'))

        // Load db models
        expressDynamicLoader(this, path.join(__dirname, 'models/mongodb'))

        // Connect to the database
        this.connectToDB()
    }

    checkConfig() {
        if (!this.config.jwtAccessSecret || !this.config.jwtRefreshSecret) {
            throw new Error('Missing JWT secret/s')
        }
    }

    connectToDB() {
        mongoose.connect(this.config.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((connection) => {
            this.dbConnection = connection
        })
    }

    start(callback) {
        this.app.listen(this.config.port, callback)
    }

    blacklistJWT(userId) {
        this.jwtDenyList.push([userId, Date.now() / 1000])
    }

    isTokenBlacklisted(userId, createdAt) {
        return this.jwtDenyList.some((token) => {
            return token[0] === userId && createdAt <= token[1]
        })
    }
}

module.exports = () => new AREA()
