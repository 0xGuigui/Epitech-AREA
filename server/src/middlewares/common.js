const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const config = require('../config')

module.exports = (area) => {
    // parse application/x-www-form-urlencoded
    area.app.use(bodyParser.urlencoded({extended: false}))

    // parse application/json
    area.app.use(bodyParser.json())

    // CORS policy
    area.app.use(cors())

    // JWT middleware
    area.app.use((req, res, next) => {
        const token = req.headers['x-access-token'] || req.headers['authorization']

        if (area.unprotectedRoutes.includes(req.path.slice(1))) {
            return next()
        }
        if (!token) {
            return res.status(401).json({message: 'No token provided'})
        }
        jwt.verify(token, config.jwtSecret,{}, (err, decoded) => {
            if (err) {
                return res.status(401).json({message: 'Invalid token'})
            }

            req.user = decoded
            next()
        })
    })
}
