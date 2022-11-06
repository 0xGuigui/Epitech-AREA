const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')

module.exports = (area) => {
    // parse application/x-www-form-urlencoded
    area.app.use(bodyParser.urlencoded({extended: false}))

    // parse application/json
    area.app.use(bodyParser.json())

    // CORS policy
    area.app.use(cors())

    // parse cookies
    area.app.use(cookieParser())

    // JWT middleware
    area.app.use((req, res, next) => {
        const token = req.headers['x-access-token'] || req.headers['authorization']

        for (const unprotectedRoute of area.unprotectedRoutes) {
            if (req.path.slice(1).startsWith(unprotectedRoute)) {
                return next()
            }
        }
        if (!token) {
            return res.status(401).json({message: 'No token provided'})
        }
        const rawToken = token.split(' ')[1]
        jwt.verify(rawToken, process.env.JWT_ACCESS_SECRET, {}, (err, decoded) => {
            if (err || area.jwtDenyList.isTokenDenied(decoded.userId, decoded.iat)) {
                return res.status(401).json({message: 'Unauthorized'})
            }
            req.jwt = decoded
            next()
        })
    })
}
