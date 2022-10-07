const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const config = require('./config')
const nodemailer = require('nodemailer')
const {expressDynamicLoader} = require('./utils/dynamicLoader')
const {loadServices} = require('./services/servicesHandler')
const JwtDenyList = require('./jwtDenyList/jwtDenyList')

class AREA {
    constructor() {
        this.app = express()
        this.config = config
        this.services = []
        this.jwtDenyList = []
        this.unprotectedRoutes = ["login", "refresh", "register", "reset-password", "about.json", "verify"]
        this.mailTransporter = undefined
        this.jwtDenyList = undefined

        // Check for required fields in the config
        this.checkConfig()

        // Load all services
        loadServices(this)

        // Load all middlewares and routes
        expressDynamicLoader(this, path.join(__dirname, 'middlewares'))
        expressDynamicLoader(this, path.join(__dirname, 'routes'))

        // Load db models
        expressDynamicLoader(this, path.join(__dirname, 'models/mongodb'))

        // Instantiate jwt deny list
        this.jwtDenyList = new JwtDenyList()

        // Load mail transporter
        this.mailTransporter = nodemailer.createTransport({
            service: this.config.mailService,
            auth: {
                user: this.config.mailUser,
                pass: this.config.mailPass
            }
        })
    }

    checkConfig() {
        if (!this.config.jwtAccessSecret || !this.config.jwtRefreshSecret || !this.config.jwtSecret) {
            throw new Error('Missing JWT secret/s')
        }
        if (!this.config.mailUser || !this.config.mailPass) {
            throw new Error('Missing mail credential/s')
        }
    }

    async connectToDB() {
        return await mongoose.connect(this.config.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    }

    async start(callback) {
        return this.app.listen(this.config.port, callback)
    }

    sendMail(mailConfig, callback) {
        this.mailTransporter.sendMail(mailConfig, callback)
    }
}

module.exports = () => new AREA()
