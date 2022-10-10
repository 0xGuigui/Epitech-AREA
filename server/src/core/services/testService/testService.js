const {Service, Action, Reaction} = require('../serviceComponents')

module.exports = (area, servicesManager) => {
    let testService = new Service('testService')
    let testAction = new Action('testAction', false)
    let testReaction = new Reaction('testReaction')

    testService.addReaction(testReaction)
    testService.addAction(testAction)

    servicesManager.addService(testService)
}
