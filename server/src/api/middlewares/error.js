module.exports = (area) => {
    area.app.all('*', (req, res) => {
        if (res.headersSent) {
            area.stats.reqPerSec++
            if (res.statusCode >= 200 && res.statusCode < 300) {
                area.stats.successReqPerSec++
            } else {
                area.stats.failedReqPerSec++
            }
            return
        }
        res.status(404).json({message: 'Not found'})
    })

    area.app.use((err, req, res, next) => {
        console.log(err.message)
        res.status(500).json({message: "Internal server error"})
    });
}
