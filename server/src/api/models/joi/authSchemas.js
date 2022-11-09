const joi = require('joi');

module.exports.loginSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
}).unknown(true);

module.exports.registerSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    email: joi.string().required(),
}).unknown(true);

module.exports.sendResetPasswordEmailSchema = joi.object({
    email: joi.string().required(),
}).unknown(true);

module.exports.resetPasswordSchema = joi.object({
    newPassword: joi.string().required(),
}).unknown(true);

module.exports.updatePasswordSchema = joi.object({
    password: joi.string().required(),
    newPassword: joi.string().required(),
}).unknown(true);

module.exports.oauthSchema = joi.object({
    code: joi.string().required(),
    redirect_uri: joi.string().required()
}).unknown(true)
