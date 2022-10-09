module.exports = (area) => {
    area.app.get('/services', (req, res) => {
        res.send('List all services');
    })

    area.app.get('/services/:service', (req, res) => {
        res.send('List all actions/reactions for a service');
    })
}
