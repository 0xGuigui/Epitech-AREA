const jwt = require('jsonwebtoken')
const payloadValidator = require('../utils/payloadValidator')
const {
    loginValidator,
    registerValidator,
    resetPasswordValidator,
    updatePasswordValidator
} = require('../utils/validationSchemas')

module.exports = (area) => {
    area.app.post('/login', ...loginValidator, (req, res) => {
        if (!payloadValidator(req, res)) return

        // Check sent information in db, here we assume that everything is ok
        let accessToken = jwt.sign({
            userId: 1,
            username: req.body.username,
            email: req.body.email
        }, area.config.jwtAccessSecret, {expiresIn: '5m'})

        jwt.sign({}, area.config.jwtRefreshSecret, {expiresIn: '1d'}, (err, refreshToken) => {
            if (err) {
                res.status(500).send({error: 'Internal server error'})
                return
            }

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: area.config.env === 'production',
                maxAge: 24 * 60 * 60 * 1000
            });
            res.status(200).send({accessToken})
        })
    })

    area.app.post('/refresh', (req, res) => {
        if (req.cookies?.jwt) {
            const refreshToken = req.cookies.jwt;

            // Verifying refresh token
            jwt.verify(refreshToken, area.config.jwtRefreshSecret, {}, (err, decoded) => {
                if (err) {
                    // Wrong Refresh Token
                    return res.status(406).json({message: 'Unauthorized'});
                } else {
                    // Correct token we send a new access token
                    const accessToken = jwt.sign({
                        userId: decoded.userId,
                        username: decoded.username,
                        email: decoded.email
                    }, area.config.jwtAccessSecret, {
                        expiresIn: '5m'
                    });
                    return res.json({accessToken});
                }
            })
        } else {
            return res.status(406).json({message: 'Unauthorized'});
        }
    })

    area.app.post('/register', ...registerValidator, (req, res) => {
        if (!payloadValidator(req, res)) return

        res.send('Register page');
    })

    area.app.post('/reset-password', ...resetPasswordValidator, (req, res) => {
        if (!payloadValidator(req, res)) return

        // Check sent information in db, here we assume that everything is ok
        area.blacklistJWT(1)
        res.send('Reset password page');
    })

    area.app.post('/update-password', ...updatePasswordValidator, (req, res) => {
        if (!payloadValidator(req, res)) return

        area.blacklistJWT(1)
        res.send('Update password page');
    })
}
