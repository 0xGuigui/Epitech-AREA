require('express-async-errors')
require('../models/joi/authSchemas')
const jwt = require('jsonwebtoken')
const {hashPassword, comparePassword} = require('../../utils/passwordHashing')
const {
    loginSchema,
    registerSchema,
    sendResetPasswordEmailSchema,
    resetPasswordSchema, registerServiceSchema, loginDiscordSchema
} = require('../models/joi/authSchemas')
const {validatePayload} = require('../middlewares/dynamic')
const mongoose = require('mongoose')

async function getRefreshToken(code, redirect_uri) {
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            redirect_uri,
            code,
            grant_type: 'authorization_code'
        })
    })
    return await response.json()
}

async function getMe(access_token) {
    const response = await fetch(`https://discord.com/api/v10/users/@me`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${access_token}`
        }
    })
    return await response.json()
}

module.exports = (area) => {
    area.app.post('/register', validatePayload(registerSchema), async (req, res) => {
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
    })

    area.app.get('/register/:token', async (req, res) => {
        jwt.verify(req.params.token, process.env.JWT_SECRET, {}, (err, decoded) => {
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
    })

    area.app.post('/login', validatePayload(loginSchema), async (req, res) => {
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
        let accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '5m'}, null)

        jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '3h'}, (err, refreshToken) => {
            if (err) {
                return res.status(500).send({error: 'Internal server error'})
            }
            res.cookie('jwt', refreshToken, {
                maxAge: 3 * 60 * 60 * 1000
            });
            res.status(200).send({
                token: accessToken,
                refreshToken: refreshToken,
            })
        })
    })

    area.app.post('/login/Discord', validatePayload(loginDiscordSchema), async (req, res) => {
        const token = await getRefreshToken(req.body.code, req.body.redirect_uri)

        if (!token)
            return res.status(401).json({message: 'Invalid verification code'})

        const user = await getMe(token.access_token)

        const sendToken = (payload, accessToken) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '3h'}, (err, refreshToken) => {
            if (err) {
                return res.status(500).send({error: 'Internal server error'})
            }
            res.cookie('jwt', refreshToken, {
                maxAge: 3 * 60 * 60 * 1000
            });
            res.status(200).send({
                token: accessToken,
                refreshToken: refreshToken,
            })
        })

        const dbUser = await mongoose.models.User.findOne({oauth: user.id}).exec()

        if (!dbUser) {
            new mongoose.models.User({
                username: user.username,
                email: user.email,
                oauth: user.id
            }).save().then(newUser => {
                const payload = {
                    userId: newUser.id,
                    username: user.username,
                    admin: newUser.admin
                }
                const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '5m'}, null)
                sendToken(payload, accessToken)
            }).catch(err => {
                if (err.code === 11000) {
                    return res.status(409).json({message: 'User already exists'})
                }
                return res.status(500).send(err)
            })
        } else {
            const payload = {
                userId: dbUser.id,
                username: user.username,
                admin: dbUser.admin
            }
            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '5m'}, null)
            sendToken(payload, accessToken)
        }
    })

    area.app.post('/refresh', (req, res) => {
        if (!req.cookies.jwt && !req.body.jwt) {
            return res.status(401).json({message: 'Unauthorized'})
        }

        jwt.verify(req.cookies.jwt || req.body.jwt, process.env.JWT_REFRESH_SECRET, {}, async (err, decoded) => {
            if (err || area.jwtDenyList.isTokenDenied(decoded.userId, decoded.iat)) {
                return res.status(401).json({message: 'Unauthorized'});
            }
            let user = await mongoose.models.User.findById(decoded.userId).exec()

            const accessToken = jwt.sign({
                userId: user.id,
                username: user.username,
                admin: user.admin,
            }, process.env.JWT_ACCESS_SECRET, {
                expiresIn: '5m'
            }, null);
            return res.json({token: accessToken});
        })
    })

    area.app.post('/reset-password', validatePayload(sendResetPasswordEmailSchema), async (req, res) => {
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
            return res.status(200).json({message: 'Processed'})
        } else {
            return res.status(404).json({message: 'User not found'})
        }
    })

    area.app.post('/reset-password/:token', validatePayload(resetPasswordSchema), (req, res) => {
        jwt.verify(req.params.token, process.env.JWT_SECRET, {}, async (err, decoded) => {
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
        })
    })

    area.app.post('/logout', (req, res) => {
        if (!req.cookies.jwt) {
            return res.status(401).json({message: 'Unauthorized'})
        }
        res.clearCookie('jwt').json({message: 'Logged out'})
    })
}
