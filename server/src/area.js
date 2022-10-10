const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const config = require('./config')
const {dynamicLoader, servicesLoader} = require('./utils/dynamicLoader')
const {hashPassword} = require('./utils/passwordHashing')
const JwtDenyList = require('./core/jwtDenyList')
const MailSender = require('./core/mailSender')

class AREA {
    constructor() {
        this.app = express()
        this.config = config
        this.services = {}
        this.unprotectedRoutes = ["login", "refresh", "register", "reset-password", "about.json", "verify"]

        // Check for required fields in the config
        this.checkConfig()

        // Load all services
        servicesLoader(this, path.join(__dirname, 'core/services'))

        // Load all middlewares and routes
        dynamicLoader(this, path.join(__dirname, 'api/middlewares'))
        dynamicLoader(this, path.join(__dirname, 'api/routes'))

        // Load db models
        dynamicLoader(this, path.join(__dirname, 'api/models/mongodb'))

        // Instantiate jwt deny list
        this.jwtDenyList = new JwtDenyList()

        // Instantiate email sender
        this.mailSender = new MailSender(config)
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
            useNewUrlParser: true, useUnifiedTopology: true,
        })
    }

    async start(callback) {
        let adminUserData = {
            password: await hashPassword(this.config.adminPassword),
            email: this.config.adminEmail,
            verified: true,
            admin: true,
        }

        let result = await mongoose.models.User.findOneAndUpdate({username: "admin"}, adminUserData, {
            upsert: true, setDefaultsOnInsert: true
        }).exec()
        console.log(`To connect to the admin panel, use the following credentials:\n\tmail: ${this.config.adminEmail}\n\tpassword: ${this.config.adminPassword}\n`)

        return this.app.listen(this.config.port, callback)
    }
}

module.exports = () => new AREA()
