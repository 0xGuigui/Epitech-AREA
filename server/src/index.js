const area = require('./area')()

// Start the server
area.start(() => {
    console.log(`Server started on port ${area.config.port}`)
})
