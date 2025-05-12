const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema(
    {
        fullname: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String },
        password: { type: String },
        phoneNumber: { type: String },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Users', Users);
