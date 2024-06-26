const logger = require('node-color-log')
const path = require('path')

module.exports.initEnv = () => {
    require('dotenv').config({ path: path.join(__dirname, '../../.env') })
}

module.exports.checkEnvConfig = (config, exitOnError = false) => {
    let errors = []

    Object.entries(config).forEach(([_, value]) => {
        let matched = false;

        if (typeof value === 'object' && value.name && value.default) {
            if (!process.env[value.name]) {
                process.env[value.name] = value.default
            }
            matched = true
        } else if (typeof value === 'string') {
            matched = !!process.env[value]
        }

        if (!matched) {
            errors.push(value.name || value)
        }
    })

    if (exitOnError && errors.length > 0) {
        logger.error("Invalid config because of the following missing keys:")
        errors.forEach(key => logger.error(key))
        process.exit(1)
    }
    return errors.length ? errors : null
}
