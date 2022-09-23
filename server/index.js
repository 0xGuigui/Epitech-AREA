const app = require('express')()

app.listen(8080, () => {
    console.log("Server ready on port 8080")
})

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