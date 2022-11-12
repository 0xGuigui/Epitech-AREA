const express = require('express')
require('express-async-errors')
const {isAdmin} = require("../middlewares/others");

let formatService = (service) => {
    return {
        name: service.name,
        description: service.description,
        actions: service.actions.map((action) => {
            return action.name
        }),
        reactions: service.reactions.map((reaction) => {
            return reaction.name
        })
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

module.exports = (area) => {
    const router = express.Router();
    const serviceRouter = express.Router({mergeParams: true});

    router.get('/', (req, res) => {
        res.status(200).json({
            services: area.servicesManager.getServices().map(formatService)
        })
    })

    router.use('/:service', serviceRouter)

    serviceRouter.get('/', (req, res) => {
        let service = area.servicesManager.getService(req.params.service)

        if (!service) {
            return res.status(404).json({message: 'Service not found'})
        }
        res.status(200).json({service: formatService(service)})
    })

    serviceRouter.get('/update-state', isAdmin, async (req, res) => {
        res.send('ok')
    })

    serviceRouter.get('/actions', (req, res) => {
        let service = area.servicesManager.getService(req.params.service)

        if (!service) {
            return res.status(404).json({message: 'Service not found'})
        }
        res.status(200).json({actions: service.actions.map(formatServiceComponent)})
    })

    serviceRouter.get('/reactions', (req, res) => {
        let service = area.servicesManager.getService(req.params.service)

        if (!service) {
            return res.status(404).json({message: 'Service not found'})
        }
        res.status(200).json({reactions: service.reactions.map(formatServiceComponent)})
    })

    serviceRouter.get('/actions/:action', (req, res) => {
        let action = area.servicesManager.getServiceAction(req.params.service + '/' + req.params.action)

        if (!action) {
            return res.status(404).json({message: 'Action not found'})
        }
        res.json({action: formatServiceComponent(action)})
    })

    serviceRouter.get('/reactions/:reaction', (req, res) => {
        let reaction = area.servicesManager.getServiceReaction(req.params.service + '/' + req.params.reaction)

        if (!reaction) {
            return res.status(404).json({message: 'Reaction not found'})
        }
        res.json({reaction: formatServiceComponent(reaction)})
    })

    area.app.use('/services', router);
}
