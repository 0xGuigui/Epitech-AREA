const mongoose = require('mongoose');
const Mixed = mongoose.Schema.Types.Mixed;

let ActionSchema = new mongoose.Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    webhook: Boolean,
    actionType: String,
    reactionType: String,
    data: Mixed,
    createdAt: { type: Date, default: Date.now },
})

module.exports = (area) => {
    mongoose.model('Action', ActionSchema);
}
