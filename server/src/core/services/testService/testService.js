const {Service, Action, Reaction} = require('../serviceComponents')
const Joi = require('joi')

module.exports = (area, servicesManager) => {
    let testService = new Service('testService')
    let testAction = new Action('testAction')
        .on('create', async (ctx) => {
            ctx.setActionData("triggerCount", 0)
            // If everything is ok, call next(), here the reactionCreate
            await ctx.next()
        })
        .on('trigger', async (ctx) => {
            // You can update stored variablesch
            ctx.setActionData('triggerCount', ctx.getActionData('triggerCount') + 1)

            // If everything is ok, call next(), here the reactionTrigger
            // You can pass variable to the next function for specific use (using next() of addEnvVariables())
            // This will be available through ctx.env
            await ctx.next({test: 'test'})
        })
    let testReaction = new Reaction('testReaction')
        .on('create', async (ctx) => {
            // Calling next() here will end the context and save/update the action
            await ctx.next()
        })
        .on('trigger', async (ctx) => {
            await ctx.next()
        })

    testAction.validationSchema = Joi.object().keys({
        test: Joi.string().required()
    }).unknown(true)
    testService.addAction(testAction)
    testService.addReaction(testReaction)
    servicesManager.addService(testService)
}
