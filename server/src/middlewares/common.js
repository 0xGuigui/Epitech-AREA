const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = (area) => {
    // parse application/x-www-form-urlencoded
    area.app.use(bodyParser.urlencoded({extended: false}))

    // parse application/json
    area.app.use(bodyParser.json())

    // CORS policy
    area.app.use(cors())
}
