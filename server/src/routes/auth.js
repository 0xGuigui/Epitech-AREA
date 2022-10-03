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
    area.app.post('/register', ...registerValidator, async (req, res) => {
        if (!payloadValidator(req, res)) return

        const {email, password, username} = req.body

        let hashedPassword = await hashPassword(password)
        let newUser = new area.mongoModels["User"]({
            username: username,
            email: email,
            password: hashedPassword,
        })

        newUser.save().then(() => {
            return res.status(200).json({message: 'User created'})
        }).catch((err) => {
            return res.status(500).json({message: err.message})
        })
    })

    area.app.post('/login', ...loginValidator, async (req, res) => {
        if (!payloadValidator(req, res)) return

        let user = await mongoose.model('User').findOne({email: req.body.email}).exec()
        if (!user) {
            return res.status(401).json({message: 'Invalid credentials'})
        }
        if (!user.verified) {
            return res.status(401).json({message: 'User not verified'})
        }
        let passwordMatch = await comparePassword(req.body.password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({message: 'Invalid credentials'})
        }
        let payload = {
            userId: user.id,
            username: req.body.username,
            isAdmin: user.isAdministrator
        }
        let accessToken = jwt.sign(payload, area.config.jwtAccessSecret, {expiresIn: '5m'}, null)

        jwt.sign(payload, area.config.jwtRefreshSecret, {expiresIn: '1d'}, (err, refreshToken) => {
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
            jwt.verify(refreshToken, area.config.jwtRefreshSecret, {}, async (err, decoded) => {
                if (err) {
                    return res.status(406).json({message: 'Unauthorized'});
                } else {
                    let user = await mongoose.model('User').findById(decoded.userId).exec()

                    const accessToken = jwt.sign({
                        userId: user.id,
                        username: user.username,
                        isAdmin: user.isAdminiastrator,
                    }, area.config.jwtAccessSecret, {
                        expiresIn: '5m'
                    }, null);
                    return res.json({accessToken});
                }
            })
        } else {
            return res.status(406).json({message: 'Unauthorized'});
        }
    })

    area.app.post('/reset-password', ...resetPasswordValidator, (req, res) => {
        if (!payloadValidator(req, res)) return

        res.send('Reset password page');
    })

    area.app.post('/update-password', ...updatePasswordValidator, async (req, res) => {
        if (!payloadValidator(req, res)) return

        let user = await mongoose.model('User').findById(req.jwt.userId).exec()

        if (!user) {
            return res.status(500).json({message: 'User no longer exists'})
        }
        let passwordMatch = await comparePassword(req.body.password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({message: 'Invalid credentials'})
        }
        user.password = await hashPassword(req.body.newPassword)
        user.save().then(() => {
            area.blacklistJWT(user.id)
            return res.status(200).json({message: 'Password updated'})
        }).catch((err) => {
            return res.status(500).json({message: err.message})
        })
    })
}
