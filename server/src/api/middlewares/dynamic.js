const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

module.exports.validatePayload = (validationSchema) => {
    return (req, res, next) => {
        const {error} = validationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }
        next();
    };
}

module.exports.setOptions = (options = {}) => {
    return (req, res, next) => {
        if (typeof options !== 'object') {
            throw new Error('Options must be an object')
        }
        Object.assign(req, options)
        next()
    }
}

module.exports.checkId = (targets = []) => {
    return (req, res, next) => {
        if (typeof targets === 'string') {
            targets = [targets]
        }
        for (const target of targets) {
            if (!ObjectId.isValid(req.params[target])) {
                return res.status(400).json({message: `${target} is not a valid mongoose id`})
            }
        }
        next()
    }
}
