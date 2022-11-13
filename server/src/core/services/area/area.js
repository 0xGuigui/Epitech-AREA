const {Service, Action, Reaction} = require('../serviceComponents')
const Joi = require('joi')
const {createWebhookToken, createActionWebhook} = require('../../../utils/createWebhookToken')

module.exports = (area, servicesManager) => {
    let areaService = new Service('AREA', "use the power of area API to connect applications", {
        mainColor: '#2c3e50',
        secondaryColor: '#000000',
        urlSite: 'http://92.148.23.72:8080/',
    })

    let freeWebhookAction = new Action('free webhook', 'get a webhook link that can be triggered anywhere by any of your custom applications', true)
        .on('create', async (ctx) => {
            createActionWebhook(area, ctx)
            await ctx.next()
        })
        .on('trigger', async (ctx) => {
            await ctx.next()
        })

    let sendEmail = new Reaction('send email', 'send an email to a specific address')
        .on('create', async (ctx) => {
            ctx.setActionData('email', ctx.payload.email)
            ctx.setActionData('subject', ctx.payload.subject)
            ctx.setActionData('message', ctx.payload.message)
            await ctx.next()
        })
        .on('trigger', async (ctx) => {
            area.mailSender.sendMail(
                ctx.getActionData('email'),
                ctx.getActionData('subject'),
                "area-template",
                ctx.getActionData('subject'),
                ctx.getActionData('message')
            )
            await ctx.next()
        })

    sendEmail.validationSchema = Joi.object().keys({
        email: Joi.string().required(),
        subject: Joi.string().required(),
        message: Joi.string().required(),
    }).unknown(true)
    areaService.addAction(freeWebhookAction)
    areaService.addReaction(sendEmail)
    servicesManager.addService(areaService)
}
