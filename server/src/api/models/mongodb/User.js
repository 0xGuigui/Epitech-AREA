const mongoose = require('mongoose');
const Mixed = mongoose.Schema.Types.Mixed;

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
    admin: {
        type: Boolean,
        default: false,
    },
    oauth: {
        type: String,
        default: null
    },
    data: Mixed
});

module.exports = (area) => {
    mongoose.model('User', userSchema);
}
