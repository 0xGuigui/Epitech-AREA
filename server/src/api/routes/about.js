module.exports = (area) => {
    area.app.get('/about.json', (req, res) => {
        res.json({
            client: {
                host: req.socket.remoteAddress
            },
            server: {
                current_time: Date.now(),
                services: area.servicesManager.services.map(service => ({
                    name: service.name,
                    actions: service.actions.map(action => ({
                        name: action.name,
                        description: action.description,
                        webhook: action.webhook,

                    })),
                    reactions: service.reactions.map(reaction => ({
                        name: reaction.name,
                        description: reaction.description

                    }))
                }))
            }
        })
    })
}
