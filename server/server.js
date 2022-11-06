const area = require('./src/area')()
const logger = require('node-color-log')

// Start the server
area.start(() => {
    logger.info(`Server started on port ${area.config.port}`)
})
