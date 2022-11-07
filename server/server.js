const area = require('./src/area')()
const logger = require('node-color-log')

area.start(() => {
    logger.info(`Server started on port ${process.env.AREA_SERVER_PORT}`)
})
