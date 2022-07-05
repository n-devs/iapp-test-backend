const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    // _id: String,
    name: String,
    price: String,
    description: String,
    image: Object,
    sid: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;