const {Service, Action, Reaction} = require('../serviceComponents')

module.exports = (area, servicesManager) => {
    let testService = new Service('testService')
    let testAction = new Action('testActionNoWebhook', 'test action', false)
    let testAction2 = new Action('testActionWebhook', 'test action', true)
    let testReaction = new Reaction('testReaction', 'test reaction')

    testAction.setFunction("onCreate", async (actionData, requestBody) => {
        // For exemple, we stock a variable name
        console.log("testActionNoWebhook onCreate")
        return {name: "paul"}
    }).setFunction("onTrigger", async (actionData, reaction) => {
        console.log("testActionNoWebhook onTrigger")
    })
    testReaction.setFunction("onCreate", async (actionData, requestBody) => {
        // we can access the previously stored variable
        return {name: actionData.data.name}
    }).setFunction("onTrigger", async (payload) => {
        console.log("testReaction onTrigger")
    })
    testService.addAction(testAction).addAction(testAction2)
    testService.addReaction(testReaction)

    servicesManager.addService(testService)
}
