require('dotenv').config()

module.exports = {
    // The port the server will listen on
    port: process.env.PORT || 8080,
    // The jwt secret used to sign the tokens
    // we recommend using the secret generator in scripts/jwtSecretGenerator.bash
    jwtSecret: process.env.JWT_SECRET || 'secret',
}
