const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const configLoader = require('./config-loader')
const logger = require('node-color-log')
const {dynamicLoader, loadFile} = require('./utils/dynamicLoader')
const {hashPassword} = require('./utils/passwordHashing')
const JwtDenyList = require('./core/jwtDenyList')
const MailSender = require('./core/mailSender')
const ServicesManager = require('./core/services/servicesManager')
const StatsManager = require('./core/statsManager')

class AREA {
    constructor() {
        this.app = express()
        this.unprotectedRoutes = ["login", "refresh", "register", "reset-password", "about.json", "verify", "webhook"]

        // Call dotenv to init env file
        configLoader.initEnv()

        // Instantiate the services manager
        this.servicesManager = new ServicesManager(this)

        // Load all configs
        this.checkConfig()

        // Instantiate stats manager
        this.statsManager = new StatsManager()

        // Load all middlewares and routes
        dynamicLoader(this, path.join(__dirname, 'api/middlewares'), ['dynamic.js', 'others.js', 'error.js'])
        dynamicLoader(this, path.join(__dirname, 'api/routes'))

        // Load error handlers
        loadFile(this, path.join(__dirname, 'api/middlewares/error.js'))

        // Load db models
        dynamicLoader(this, path.join(__dirname, 'api/models/mongodb'))

        // Instantiate jwt deny list
        this.jwtDenyList = new JwtDenyList()

        // Instantiate email sender
        this.mailSender = new MailSender()
    }

    checkConfig() {
        let config = require('../config.json')
        let serviceCount = 0
        let erroredServicesCount = 0

        configLoader.checkEnvConfig(config.baseConfig, true);
        logger.success("Server environment variables successfully loaded")
        this.servicesManager.getServices().forEach(service => {
            serviceCount++
            if (config[service.name]) {
                let errors = configLoader.checkEnvConfig(config[service.name], false);

                if (errors) {
                    service.disable()
                    erroredServicesCount++
                    logger.warn(`${service.name} service has been disabled because of missing variables:`)
                    errors.forEach(error => logger.warn(error))
                }
            }
        })

        if (erroredServicesCount > 0) {
            logger.warn(`${erroredServicesCount} service(s) out of ${serviceCount} have been disabled because of missing variables.`)
        } else {
            logger.info(`${serviceCount} services out of ${serviceCount} have been loaded`)
        }
    }

    async connectToDB() {
        let mongoHost = process.env.NODE_ENV === "production" ? "area-mongo" : "localhost"
        let mongoUrl = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${mongoHost}:${process.env.AREA_MONGO_PORT}`

        logger.info(`Connecting to MongoDB at ${mongoUrl}`)
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        logger.success("Connected to MongoDB")
        // Init stats manager
        await this.statsManager.init(this)
    }

    async start(callback) {
        let adminUserData = {
            password: await hashPassword(process.env.ADMIN_PASSWORD),
            email: process.env.ADMIN_EMAIL,
            verified: true,
            admin: true,
        }

        await this.connectToDB()
        await mongoose.models.User.findOneAndUpdate({username: "admin"}, adminUserData, {
            upsert: true, setDefaultsOnInsert: true
        }).exec()
        logger.debug("Admin user created, check your .env for credentials")

        return this.app.listen(process.env.PORT || process.env.AREA_SERVER_PORT, callback)
    }
}

module.exports = () => new AREA()
