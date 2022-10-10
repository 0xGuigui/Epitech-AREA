const mongoose = require('mongoose');
const Mixed = mongoose.Schema.Types.Mixed;

let ReactionSchema = new mongoose.Schema({
    type: {
        service: String,
        name: String,
    },
    data: Mixed,
}, {_id: false});

let ActionSchema = new mongoose.Schema({
    actionName: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        service: String,
        name: String,
    },
    data: Mixed,
    reaction: ReactionSchema,
    createdAt: Date,
})

module.exports = (area) => {
    mongoose.model('Action', ActionSchema);
}
