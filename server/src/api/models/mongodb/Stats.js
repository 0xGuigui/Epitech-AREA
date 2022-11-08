const mongoose = require('mongoose');
const Mixed = mongoose.Schema.Types.Mixed;

let StatsEntrySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    data: Mixed
}, {_id: false, versionKey: false})

let StatsSchema = new mongoose.Schema({
    statsQueue: [StatsEntrySchema]
}, {versionKey: false})

module.exports = (area) => {
    mongoose.model('Stats', StatsSchema);
}
