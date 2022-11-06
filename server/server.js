const area = require('./src/area')()
const logger = require('node-color-log')

// Start the server
area.start(() => {
    logger.info(`Server started on port ${process.env.AREA_SERVER_PORT}`)
})
