module.exports.isAdmin = (req, res, next) => {
    if (!req.jwt.admin) {
        return res.status(401).json({message: 'Unauthorized'})
    }
    next()
}
