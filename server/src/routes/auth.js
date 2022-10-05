const jwt = require('jsonwebtoken')
const fs = require('fs')
const payloadValidator = require('../utils/payloadValidator')
const {hashPassword, comparePassword} = require('../utils/passwordHashing')
const {formatString} = require('../utils/stringUtils')
const mongoose = require('mongoose')
const {
    loginValidator,
    registerValidator,
    resetPasswordValidator,
    updatePasswordValidator,
    sendResetPasswordEmailValidator
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
        newUser.save().then((info) => {
            let mailTemplate = fs.readFileSync(__dirname + '/../../mail/register-template.html', 'utf8')

            let verifyToken = jwt.sign({
                id: info._id,
            }, area.config.jwtSecret, {
                expiresIn: '1d'
            }, null)
            area.sendMail({
                from: area.config.mailUser,
                to: email,
                subject: 'Area - Verify your account',
                html: formatString(mailTemplate, 'paul', 'http://' + req.get('host') + '/verify/' + verifyToken)
            }, (err, _) => {
                if (err) {
                    return res.status(500).json({message: err.message})
                }
                res.status(200).json({message: 'User created'})
            })
        }).catch((err) => {
            return res.status(500).json({message: err.message})
        })
    })

    area.app.get('/verify/:token', async (req, res) => {
        jwt.verify(req.params.token, area.config.jwtSecret, {}, (err, decoded) => {
            if (err) {
                return res.status(500).json({message: err.message})
            }
            area.mongoModels["User"].findByIdAndUpdate(decoded.id, {verified: true}, (err, _) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({message: err.message})
                }
                res.status(200).json({message: 'User verified'})
            })
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
                return res.status(500).send({error: 'Internal server error'})
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

    area.app.post('/reset-password', ...sendResetPasswordEmailValidator, async (req, res) => {
        if (!payloadValidator(req, res)) return

        let user = await mongoose.model('User').findOne({email: req.body.email}).exec()
        if (!user) {
            return res.status(200).json({message: 'Processed'})
        }
        let mailTemplate = fs.readFileSync(__dirname + '/../../mail/reset-password-template.html', 'utf8')
        let verifyToken = jwt.sign({
            id: user.id,
        }, area.config.jwtSecret, {
            expiresIn: '1d'
        }, null)
        area.sendMail({
            from: area.config.mailUser,
            to: user.email,
            subject: 'Reset password',
            html: formatString(mailTemplate, user.username, 'http://' + req.get('host') + '/reset-password/' + verifyToken)
        }, (err, _) => {
            if (err) {
                return res.status(500).json({message: err.message})
            }
            return res.status(200).json({message: 'Processed'})
        })
    })

    area.app.get('/reset-password/:token', ...resetPasswordValidator, async (req, res) => {
        if (!payloadValidator(req, res)) return

        jwt.verify(req.params.token, area.config.jwtSecret, {}, (err, decoded) => {
            if (err) {
                return res.status(500).json({message: err.message})
            }
            let hashedPassword = hashPassword(req.body.password)
            area.mongoModels["User"].findByIdAndUpdate(decoded.id, {password: hashedPassword}, (err, _) => {
                if (err) {
                    return res.status(500).json({message: err.message})
                }
                return res.status(200).json({message: 'Password reset'})
            })
        })
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
