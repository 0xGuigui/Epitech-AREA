const path = require('path')
const express = require('express')
const config = require('./config')
const {expressDynamicLoader} = require('./utils/dynamicLoader')
const {loadServices} = require('./services/servicesHandler')

class AREA {
    constructor() {
        this.app = express()
        this.config = config
        this.services = []

        // Load all services
        loadServices(this)

        // Load all middlewares and routes
        expressDynamicLoader(this, path.join(__dirname, 'middlewares'))
        expressDynamicLoader(this, path.join(__dirname, 'routes'))
    }

    start(callback) {
        // Start the server
        this.app.listen(this.config.port, callback)
    }
}

module.exports = () => new AREA()
