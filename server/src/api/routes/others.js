const mongoose = require('mongoose')

module.exports = (area) => {
    area.app.get('/purge-database', async (req, res) => {
        if (!req.jwt.admin) {
            return res.status(401).json({message: 'Unauthorized'})
        }

        try {
            await mongoose.models.User.deleteMany({username: {$ne: "admin"}}).exec()
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
        return res.status(200).json({message: "Database purged"})
    })
}