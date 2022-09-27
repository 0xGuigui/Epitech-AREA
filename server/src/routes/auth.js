const jwt = require('jsonwebtoken');
const payloadValidator = require('../utils/payloadValidator')
const {
    loginValidator,
    registerValidator,
    resetPasswordValidator,
    updatePasswordValidator
} = require('../utils/validationSchemas')

module.exports = (area) => {
    area.app.post('/login', ...loginValidator, (req, res) => {
        if (!payloadValidator(req, res)) return

        return res.send('Login')
    })

    area.app.post('/register', ...registerValidator, (req, res) => {
        if (!payloadValidator(req, res)) return

        res.send('Register page');
    })

    area.app.post('/reset-password', ...resetPasswordValidator, (req, res) => {
        if (!payloadValidator(req, res)) return

        res.send('Reset password page');
    })

    area.app.post('/update-password', ...updatePasswordValidator, (req, res) => {
        if (!payloadValidator(req, res)) return

        res.send('Update password page');
    })
}
