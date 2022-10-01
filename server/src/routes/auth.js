const jwt = require('jsonwebtoken')
const payloadValidator = require('../utils/payloadValidator')
const {hashPassword, comparePassword} = require('../utils/passwordHashing')
const mongoose = require('mongoose')
const {
    loginValidator,
    registerValidator,
    resetPasswordValidator,
    updatePasswordValidator
} = require('../models/validationModels')

module.exports = (area) => {
    area.app.post('/login', ...loginValidator, async (req, res) => {
        if (!payloadValidator(req, res)) return

        const {email, password} = req.body
        let user = await mongoose.model('User').findOne({email: email}).exec()
        if (!user) {
            return res.status(401).json({message: 'Invalid credentials'})
        }
        let passwordMatch = await comparePassword(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({message: 'Invalid credentials'})
        }
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

    area.app.post('/register', ...registerValidator, async (req, res) => {
        if (!payloadValidator(req, res)) return

        const {email, password, username} = req.body

        let newUser = new mongoose.model('User')({
            username: username,
            email: email,
            password: await hashPassword(password),
        })

        newUser.save().then(() => {
            res.status(200).json({message: 'User created'})
        }).catch((err) => {
            res.status(500).json({message: 'Internal server error'})
        })
        res.status(200).json({message: 'User created'})
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
