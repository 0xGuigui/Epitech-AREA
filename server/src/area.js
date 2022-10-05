const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const config = require('./config')
const nodemailer = require('nodemailer')
const {expressDynamicLoader} = require('./utils/dynamicLoader')
const {loadServices} = require('./services/servicesHandler')

class AREA {
    constructor() {
        this.app = express()
        this.config = config
        this.dbConnection = null
        this.mongoModels = {}
        this.services = []
        this.jwtDenyList = []
        this.unprotectedRoutes = ["login", "refresh", "register", "reset-password", "about.json", "verify"]
        this.mailTransporter = null

        // Check for required fields in the config
        this.checkConfig()

        // Load all services
        loadServices(this)

        // Load all middlewares and routes
        expressDynamicLoader(this, path.join(__dirname, 'middlewares'))
        expressDynamicLoader(this, path.join(__dirname, 'routes'))

        // Load db models
        expressDynamicLoader(this, path.join(__dirname, 'models/mongodb'))

        // Load mail transporter
        this.mailTransporter = nodemailer.createTransport({
            service: this.config.mailService,
            auth: {
                user: this.config.mailUser,
                pass: this.config.mailPass
            }
        })

        // Connect to the database
        this.connectToDB()
    }

    checkConfig() {
        if (!this.config.jwtAccessSecret || !this.config.jwtRefreshSecret || !this.config.jwtSecret) {
            throw new Error('Missing JWT secret/s')
        }
        if (!this.config.mailUser || !this.config.mailPass) {
            throw new Error('Missing mail credential/s')
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

    sendMail(mailConfig, callback) {
        this.mailTransporter.sendMail(mailConfig, callback)
    }
}

module.exports = () => new AREA()
