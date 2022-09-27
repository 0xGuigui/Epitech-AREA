const payloadValidator = require('express-validator');

// Check payload and send an error if it's not valid
// return a boolean to know if the payload is valid or not
module.exports = (req, res) => {
    const errors = payloadValidator.validationResult(req)

    if (!errors.isEmpty()) {
        res.status(422).json({errors: errors.array()})
        return false
    }
    return true
}
