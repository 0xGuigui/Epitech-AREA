const express = require('express');

module.exports = (area) => {
    const router = express.Router();

    router.route('/')
        .get((req, res) => {
            // use query to get the search index (to not return too many results)
            res.send('Get all actions (for admins or people with the right permissions)');
        })
        .post((req, res) => {
            res.send('Create a new action');
        })

    router.route('/:actionId')
        .get((req, res) => {
            res.send('Get action by id');
        })
        .put((req, res) => {
            res.send('Update action by id');
        })
        .delete((req, res) => {
            res.send('Delete action by id');
        })

    area.app.use('/actions', router);
}
