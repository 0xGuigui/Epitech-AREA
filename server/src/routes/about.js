module.exports = function (app) {
    app.get('/about.json', (req, res) => {
        res.json({
            client: {
                host: req.socket.remoteAddress
            },
            server: {
                current_time: Date.now(),
                services: []
            }
        })
    })
}
