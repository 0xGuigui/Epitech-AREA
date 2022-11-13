const {formatService} = require("../../utils/services");

module.exports = (area) => {
    area.app.get('/about.json', (req, res) => {
        res.json({
            client: {
                host: req.socket.remoteAddress
            },
            server: {
                current_time: Date.now(),
                services: area.servicesManager.getServices().map(formatService)
            }
        })
    })
}
