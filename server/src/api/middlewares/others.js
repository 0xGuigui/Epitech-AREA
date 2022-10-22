module.exports.isAdmin = (req, res, next) => {
    if (!req.jwt.admin) {
        return res.status(401).json({message: 'Unauthorized'})
    }
    next()
}

module.exports.checkAreaInstance = (req, res, next) => {
    if (!req.areaInstance) {
        return res.status(500).json({message: 'Internal server error'})
    }
    next()
}
