const logger = require('node-color-log')

module.exports.initEnv = () => {
    require('dotenv').config({ path: '../../.env' })
}

module.exports.checkEnvConfig = (config, exitOnError) => {
    let errors = []

    Object.entries(config).forEach(([key, value]) => {
        let matched = false;

        if (typeof value === 'object' && value.name && value.default) {
            if (!process.env[value.name]) {
                process.env[value.name] = value.default
            }
            matched = true
        } else if (typeof value === 'string') {
            if (process.env[value]) {
                matched = true
            }
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
    return errors.length ? errors : true
}
