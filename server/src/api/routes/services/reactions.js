const express = require('express');

module.exports = (area) => {
    const router = express.Router();

    area.app.get('/reactions', (req, res) => {
        // use query to get the search index (to not return too many results)
        res.send('Get all reactions (for admins or people with the right permissions)');
    })

    router.route('/:actionId/reactions')
        .get((req, res) => {
            res.send('Get all reactions associated to an action (for admins or people with the right permissions)');
        })
        .post((req, res) => {
            res.send('Add a reaction to an action');
        })

    router.route('/:actionId/reactions/:reactionId')
        .get((req, res) => {
            res.send('Get a specific reaction');
        })
        .put((req, res) => {
            res.send('Update a specific reaction');
        })
        .delete((req, res) => {
            res.send('Delete a specific reaction');
        });

    area.app.use('/actions', router);
}