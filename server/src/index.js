require('dotenv').config()
const path = require('path')
const {expressDynamicLoader} = require('./utils/dynamicLoader')
const app = require('express')()
const port = process.env.PORT || 8080

// Load all middleware
expressDynamicLoader(app, path.join(__dirname, 'middlewares'))

// Load all routes
expressDynamicLoader(app, path.join(__dirname, 'routes'))

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
