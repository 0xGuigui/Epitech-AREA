let formatService = (service) => {
    return {
        name: service.name,
        active: service.active,
        locked: service.locked,
        description: service.description,
        actions: service.actions.map((action) => {
            return action.name
        }),
        reactions: service.reactions.map((reaction) => {
            return reaction.name
        }),
        colorPalette: service.colorPalette
    }
}

let formatServiceComponent = (serviceComponent) => {
    let componentFields = serviceComponent.validationSchema ? serviceComponent.validationSchema.describe().keys : null

    return {
        name: serviceComponent.name,
        description: serviceComponent.description,
        fields: componentFields,
    }
}

module.exports = {
    formatService,
    formatServiceComponent
}
