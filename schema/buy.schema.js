const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BuySchema = new Schema({
    // _id: String,
    pid: String,
    uid: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Buy = mongoose.model('Buy', BuySchema);
module.exports = Buy;