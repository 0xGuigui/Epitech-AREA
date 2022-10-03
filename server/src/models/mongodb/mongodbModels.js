const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    isAdministrator: {
        type: Boolean,
        default: false,
    }
});

module.exports = (area) => {
    area.mongoModels["User"] = mongoose.model('User', userSchema);
}
