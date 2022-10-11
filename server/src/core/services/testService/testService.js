const {Service, Action, Reaction} = require('../serviceComponents')

module.exports = (area, servicesManager) => {
    let testService = new Service('testService')
    let testAction = new Action('testActionNoWebhook', 'test action', false)
    let testAction2 = new Action('testActionWebhook', 'test action', true)
    let testReaction = new Reaction('testReaction', 'test reaction')

    testAction.setFunction("onCreate", async (payload) => {
        // For exemple, we stock a variable name
        return {name: "paul"}
    })
    testService.addAction(testAction).addAction(testAction2)
    testService.addReaction(testReaction)

    servicesManager.addService(testService)
}
