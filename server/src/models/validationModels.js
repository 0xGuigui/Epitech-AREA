const config = require('../config');
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

let resetPasswordValidator = [
    expressValidator.check('email').isEmail(),
]

let updatePasswordValidator = [
    expressValidator.check('password').isLength({min: config.minPasswordLength}),
    expressValidator.check('newPassword').isLength({min: config.minPasswordLength}),
]

module.exports = {loginValidator, registerValidator, resetPasswordValidator, updatePasswordValidator}
