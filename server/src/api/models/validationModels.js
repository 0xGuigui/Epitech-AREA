const config = require('../../config');
const expressValidator = require("express-validator");

let loginValidator = [
    expressValidator.check('email').isEmail(),
    expressValidator.check('password').isLength({min: config.minPasswordLength}),
]

let registerValidator = [
    expressValidator.check('username').isLength({min: 1}),
    expressValidator.check('email').isEmail(),
    expressValidator.check('password').isLength({min: config.minPasswordLength}),
]

let sendResetPasswordEmailValidator = [
    expressValidator.check('email').isEmail(),
]

let resetPasswordValidator = [
    expressValidator.check('newPassword').isLength({min: config.minPasswordLength}),
]

let updatePasswordValidator = [
    expressValidator.check('password').isLength({min: config.minPasswordLength}),
    expressValidator.check('newPassword').isLength({min: config.minPasswordLength}),
]

let createActionValidator = [
    expressValidator.check('actionType').isLength({min: 1}),
    expressValidator.check('reactionType').isLength({min: 1}),
]

module.exports = {
    loginValidator,
    registerValidator,
    resetPasswordValidator,
    sendResetPasswordEmailValidator,
    updatePasswordValidator,
    createActionValidator,
}
