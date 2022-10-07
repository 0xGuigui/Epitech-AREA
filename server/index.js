const area = require('./src/area')()

// Start the server
area.connectToDB().then(() => {
    area.app.listen(area.config.port, () => {
        console.log(`Server started on port ${area.config.port}: http://localhost:${area.config.port}`)
    })
}).catch(err => {
    console.error(err)
})
