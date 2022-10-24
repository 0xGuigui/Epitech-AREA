require('dotenv').config()

module.exports = {
    // Admin user config
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@admin.admin',
    // The port the server will listen on
    port: process.env.PORT || 8080,
    // Project
    // --- JWT ---
    // The jwt secret used to sign the tokens
    // we recommend using the secret generator in scripts/jwtSecretGenerator.bash
    jwtSecret: process.env.JWT_SECRET || undefined,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || undefined,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || undefined,
    env: process.env.NODE_ENV || 'development',
    minPasswordLength: 5,
    // MongoDB URI: mongodb://[username:password@]host1[:port1][/[database][?options]]
    dbURL: process.env.DB_URL || 'mongodb://localhost:27017',
    mailService: process.env.MAIL_SERVICE || 'gmail',
    mailUser: process.env.MAIL_USER || undefined,
    mailPass: process.env.MAIL_PASS || undefined,
    // ID tokens to authenticate with APIs
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI
}
