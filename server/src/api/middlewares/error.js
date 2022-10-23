module.exports = (area) => {
    area.app.all('*', (req, res) => {
        res.status(404).json({message: 'Not found'})
    })

    area.app.use((err, req, res, next) => {
        res.status(500).json({message: "Internal server error"})
    });
}
