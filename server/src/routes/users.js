const express = require('express')

module.exports = (area) => {
    const router = express.Router()

    router.get('/', (req, res) => {
        // use query to get the search index (to not return too many results)
        res.send('Get all users  (for admins or people with the right permissions)')
    })

    router.get('/search/:name', (req, res) => {
        // use query to get the search page index (to not return too many results)
        res.send('Search user')
    })

    router.route('/:userId')
        .get((req, res) => {
            res.send('Get a user')
        })
        .put((req, res) => {
            res.send('Update a user')
        })
        .delete((req, res) => {
            res.send('Delete a user')
        })

    area.app.use('/users', router)
}
