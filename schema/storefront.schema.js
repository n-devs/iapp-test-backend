const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreFrontSchema = new Schema({
    // _id: String,
    name: String,
    description: String,
    image: Object,
    owner: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const StoreFront = mongoose.model('StoreFront', StoreFrontSchema);
module.exports = StoreFront;