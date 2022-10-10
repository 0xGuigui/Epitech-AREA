const payloadValidator = require('express-validator');

// Check payload and send an error if it's not valid
module.exports = (req, res, next) => {
    const errors = payloadValidator.validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    next()
}
