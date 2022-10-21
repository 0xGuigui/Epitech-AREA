const joi = require('joi');

module.exports.createActionSchema = joi.object({
    actionType: joi.string().required(),
    reactionType: joi.string().required(),
}).unknown(true);
