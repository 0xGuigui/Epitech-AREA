require('../models/joi/authSchemas')
const jwt = require('jsonwebtoken')
const {hashPassword, comparePassword} = require('../../utils/passwordHashing')
const {loginSchema, registerSchema, sendResetPasswordEmailSchema, resetPasswordSchema} = require('../models/joi/authSchemas')
const {validatePayload} = require('../middlewares/dynamic')
const mongoose = require('mongoose')
const wrap = require('async-middleware').wrap

module.exports = (area) => {
    area.app.post('/register', validatePayload(registerSchema), wrap(async (req, res) => {
        new mongoose.models.User({
            username: req.body.username,
            email: req.body.email,
            password: await hashPassword(req.body.password),
        }).save().then((newUser) => {
            let verifyToken = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1d'}, null)
            let redirectUrl = 'http://' + req.get('host') + '/register/' + verifyToken

            area.mailSender.sendMail(
                newUser.email,
                'Area - Verify your account',
                'verify-account-template',
                newUser.username,
                redirectUrl
            )
            res.status(200).json({message: 'User created'})
        }).catch((err) => {
            if (err.code === 11000) {
                return res.status(409).json({message: 'User already exists'})
            }
            return res.status(500).send(err)
        })
    }))

    area.app.get('/register/:token', wrap(async (req, res) => {
        jwt.verify(req.params.token, area.config.jwtSecret, {}, (err, decoded) => {
            if (err) {
                return res.status(401).json({message: 'Invalid token'})
            }
            mongoose.models.User.findByIdAndUpdate(decoded.id, {verified: true}, (err, _) => {
                if (err) {
                    return res.status(500).json({message: err.message})
                }
                return res.status(200).json({message: 'User verified'})
            })
        })
    }))

    area.app.post('/login', validatePayload(loginSchema), wrap(async (req, res) => {
        let user = await mongoose.models.User.findOne({email: req.body.email}).exec()

        if (!user || !await comparePassword(req.body.password, user.password)) {
            return res.status(401).json({message: 'Invalid credentials'})
        }
        if (!user.verified) {
            return res.status(401).json({message: 'User not verified'})
        }
        let payload = {
            userId: user.id,
            username: req.body.username,
            admin: user.admin
        }
        let accessToken = jwt.sign(payload, area.config.jwtAccessSecret, {expiresIn: '5m'}, null)

        jwt.sign(payload, area.config.jwtRefreshSecret, {expiresIn: '3h'}, (err, refreshToken) => {
            if (err) {
                return res.status(500).send({error: 'Internal server error'})
            }
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: area.config.env === 'production',
                maxAge: 3 * 60 * 60 * 1000
            });
            res.status(200).send({token: accessToken})
        })
    }))

    area.app.post('/refresh', (req, res) => {
        if (!req.cookies.jwt) {
            return res.status(401).json({message: 'Unauthorized'})
        }

        jwt.verify(req.cookies.jwt, area.config.jwtRefreshSecret, {}, wrap(async (err, decoded) => {
            if (err || area.jwtDenyList.isTokenDenied(decoded.userId, decoded.iat)) {
                return res.status(401).json({message: 'Unauthorized'});
            }
            let user = await mongoose.models.User.findById(decoded.userId).exec()

            const accessToken = jwt.sign({
                userId: user.id,
                username: user.username,
                admin: user.admin,
            }, area.config.jwtAccessSecret, {
                expiresIn: '5m'
            }, null);
            return res.json({token: accessToken});
        }))
    })

    area.app.post('/reset-password', validatePayload(sendResetPasswordEmailSchema), wrap(async (req, res) => {
        let user = await mongoose.models.User.findOne({email: req.body.email}).exec()

        if (user) {
            let verifyToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'}, null)
            let redirectUrl = 'http://' + req.get('host') + '/reset-password/' + verifyToken

            area.mailSender.sendMail(
                user.email,
                'Area - Reset your password',
                'reset-password-template',
                user.username,
                redirectUrl
            )
        }
        return res.status(200).json({message: 'Processed'})
    }))

    area.app.get('/reset-password/:token', validatePayload(resetPasswordSchema), (req, res) => {
        jwt.verify(req.params.token, area.config.jwtSecret, {}, wrap(async (err, decoded) => {
            if (err) {
                return res.status(401).json({message: 'Invalid token'})
            }
            let hashedPassword = await hashPassword(req.body.newPassword)

            mongoose.models.User.findByIdAndUpdate(decoded.id, {password: hashedPassword}, (err, _) => {
                if (err) {
                    return res.status(500).json({message: err.message})
                }
                area.jwtDenyList.addDeniedUser(decoded.id)
                return res.status(200).json({message: 'Password reset'})
            })
        }))
    })
}
