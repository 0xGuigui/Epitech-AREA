const mongoose = require('mongoose');
const Mixed = mongoose.Schema.Types.Mixed;

let ReactionSchema = new mongoose.Schema({
    type: String,
    data: Mixed,
}, {_id: false});

let ActionSchema = new mongoose.Schema({
    actionName: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: String,
    webhook: Boolean,
    data: Mixed,
    reaction: ReactionSchema,
    createdAt: { type: Date, default: Date.now },
})

module.exports = (area) => {
    mongoose.model('Action', ActionSchema);
}
