const mongoose = require('mongoose')
const jsonwebtoken = require('jsonwebtoken')
const {validatePayload} = require("../middlewares/dynamic");
const {registerSchema, oauthSchema} = require("../models/joi/authSchemas");
const {hashPassword} = require("../../utils/passwordHashing");
const jwt = require("jsonwebtoken");

module.exports = (area) => {
    area.app.delete('/purge-database', async (req, res) => {
        if (!req.jwt.admin) {
            return res.status(401).json({message: 'Unauthorized'})
        }

        try {
            await mongoose.models.User.deleteMany({username: {$ne: "admin"}}).exec()
            await mongoose.models.Action.deleteMany({}).exec()
            area.jwtDenyList.addGlobalDenyRule()

            return res.status(200).json({message: 'Database purged'})
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    })

    area.app.get('/webhook/:webhookToken', async (req, res) => {
        jsonwebtoken.verify(req.params.webhookToken, area.config.jwtSecret, {}, async (err, decoded) => {
            if (err) {
                return res.status(401).json({message: 'Unauthorized'})
            }
            let actionData = await mongoose.models.Action.findById(decoded.actionId).exec()

            if (!actionData) {
                return res.status(404).json({message: 'Unauthorized'})
            }
            let reaction = area.servicesManager.getServiceReaction(actionData.reaction.type.service, actionData.reaction.type.name)

            reaction.onTrigger?.(actionData, req.body)
            return res.status(200).json({message: 'Webhook triggered'})
        })
    })

    area.app.get('/oauth2/:service', (req, res) => {
        res.redirect(`area:///oauth2/${req.params.service}?code=${req.query.code}`)
    })

    area.app.post('/oauth2/:service', validatePayload(oauthSchema), async (req, res) => {
        let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId

        const service = area.serviceManager.getService(req.params.service)

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

        user.data[req.params.service] = service.authenticate(req.body.code)
        await user.save()

        return res.json({message: 'Processed'})
    })

    area.app.get('/oauth2/:service/check-token', async (req, res) => {
        let userId = req.userIdLocation === "jwt" ? req.jwt.userId : req.params.userId

        const service = area.serviceManager.getService(req.params.service)

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

        if (service.checkToken(user.data[req.params.service]))
            return res.json({message: 'Valid token'})
        res.status(498).json({message: 'Invalid token'})
    })

    area.app.get('/events-stream', async (req, res) => {
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
    })
}
