require('dotenv').config()

module.exports = {
    // The port the server will listen on
    port: process.env.PORT || 8080,
    // The jwt secret used to sign the tokens
    // we recommend using the secret generator in scripts/jwtSecretGenerator.bash
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || undefined,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || undefined,
    env: process.env.NODE_ENV || 'development',
    minPasswordLength: 5,
}
