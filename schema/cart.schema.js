const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    // _id: String,
    pid: String,
    uid: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;