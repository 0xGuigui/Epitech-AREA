module.exports = (area) => {
    area.app.get('/users', (req, res) => {
        res.send('Get all users (for admins)')
    })

    area.app.get('/users/:id', (req, res) => {
        res.send('Get user with id ' + req.params.id)
    })
}
