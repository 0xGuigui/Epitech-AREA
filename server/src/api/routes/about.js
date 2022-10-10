module.exports = (area) => {
    area.app.get('/about.json', (req, res) => {
        res.json({
            client: {
                host: req.socket.remoteAddress
            },
            server: {
                current_time: Date.now(),
                services: area.servicesManager.services.map(service => {
                    return {
                        name: service.name,
                        actions: service.actions.map(action => {
                            return {
                                name: action.name,
                                description: action.description
                            }
                        }),
                        reactions: service.reactions.map(reaction => {
                            return {
                                name: reaction.name,
                                description: reaction.description
                            }
                        })
                    }
                })
            }
        })
    })
}
