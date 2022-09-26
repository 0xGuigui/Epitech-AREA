const jwt = require('jsonwebtoken');

module.exports = (area) => {
    area.app.post('/login', (req, res) => {
        res.send('Login page')
    })

    area.app.post('/register', (req, res) => {
        res.send('Register page');
    })

    area.app.post('/reset-password', (req, res) => {
        res.send('Reset password page');
    })

    area.app.post('/update-password', (req, res) => {
        res.send('Update password page');
    })
}
