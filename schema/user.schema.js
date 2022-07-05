const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    // _id: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

UserSchema.statics.authenticate = (email, password, callback) => {
    User.findOne({ email: email })
        .exec((err, user) => {
            if (err) {
                return callback(err)
            } else if (!user) {
                const err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        })
}


var User = mongoose.model('User', UserSchema);
module.exports = User;