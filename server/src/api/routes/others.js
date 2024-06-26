const mongoose = require('mongoose')
const jsonwebtoken = require('jsonwebtoken')
const {validatePayload} = require("../middlewares/dynamic");
const {oauthSchema} = require("../models/joi/authSchemas");
const jwt = require("jsonwebtoken");
const {isAdmin} = require("../middlewares/others");

module.exports = (area) => {
    area.app.delete('/purge-database', [isAdmin, async (req, res) => {
        try {
            await mongoose.models.User.deleteMany({username: {$ne: "admin"}}).exec()
            await mongoose.models.Action.deleteMany({}).exec()
            area.jwtDenyList.addGlobalDenyRule()

            return res.status(200).json({message: 'Database purged'})
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    }])

    area.app.get('/webhook/:webhookToken', async (req, res) => {
        jsonwebtoken.verify(req.params.webhookToken, process.env.JWT_SECRET, {}, async (err, decoded) => {
            if (err) {
                return res.status(401).json({message: 'Unauthorized'})
            }
            let actionData = await mongoose.models.Action.findById(decoded.actionId).exec()

            if (!actionData) {
                return res.status(404).json({message: 'Unauthorized'})
            }
            let {error, action} = await area.servicesManager.triggerAction(actionData);

            if (error) {
                return res.status(500).json({message: error.message})
            }
            return res.status(200).json({message: 'Reaction triggered'})
        })
    })

    area.app.get('/oauth2/:service', (req, res) => {
        res.redirect(`area:///oauth2/${req.params.service}?code=${req.query.code}`)
    })

    area.app.post('/oauth2/:service', validatePayload(oauthSchema), async (req, res) => {
        let token = req.headers['x-access-token'] || req.headers['authorization']

        if (!token && req.query.token) {
            token = "Bearer " + req.query.token
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
        })

        let userId = req.jwt.userId

        const service = area.servicesManager.getService(req.params.service)

        if (!service) {
            return res.status(404).json({message: 'Service not found'})
        }

        let user = await mongoose
            .model("User")
            .findById(userId)
            .exec()

        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }

        const mobile = req.query.mobile || false
        const redirect_uri = req.body.redirect_uri
        const auth = await service.authenticate(req.body.code, redirect_uri, mobile)

        if (!auth)
            return res.status(401).json({message: 'Invalid verification code'})

        user.data = {
            ...user.data,
            [req.params.service]: auth
        }
        await user.save()

        return res.json({message: 'Processed'})
    })

    area.app.delete('/oauth2/:service', async (req, res) => {
        let token = req.headers['x-access-token'] || req.headers['authorization']

        if (!token && req.query.token) {
            token = "Bearer " + req.query.token
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
        })

        let userId = req.jwt.userId

        let user = await mongoose
            .model("User")
            .findById(userId)
            .exec()

        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }

        if (!(user.data || {})[req.params.service]) {
            return res.status(401).json({message: 'No token to delete'})
        }
        const data = {...user.data}
        delete data[req.params.service]
        user.data = data
        await user.save()

        return res.json({message: 'Processed'})
    })

    area.app.get('/oauth2/:service/check-token', async (req, res) => {
        let token = req.headers['x-access-token'] || req.headers['authorization']

        if (!token && req.query.token) {
            token = "Bearer " + req.query.token
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
        })

        let userId = req.jwt.userId

        const service = area.servicesManager.getService(req.params.service)

        if (!service) {
            return res.status(404).json({message: 'Service not found'})
        }

        let user = await mongoose
            .model("User")
            .findById(userId)
            .exec()

        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }

        if (!(user.data ? user.data[req.params.service] : null))
            return res.status(401).json({message: 'No token to check'})

        const response = await service.checkToken(user.data ? user.data[req.params.service] : null, userId)
        if (response)
            return res.json({message: 'Valid token'})
        res.status(401).json({message: 'Invalid token'})
    })

    area.app.get('/server-stream-events', [isAdmin, async (req, res) => {
        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        res.flushHeaders();

        area.statsManager.addOpenedRequest(res)

        res.on('close', () => {
            area.statsManager.removeOpenedRequest(res)
        })
    }])
}
