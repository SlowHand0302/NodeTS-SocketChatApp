const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Conversations = new Schema(
    {
        name: { type: String },
        admins: [{ type: mongoose.Types.ObjectId, ref: 'Users', required: true, $each: { required: true } }],
        members: [{ type: mongoose.Types.ObjectId, ref: 'Users', required: true, $each: { required: true } }],
        messages: [{ type: mongoose.Types.ObjectId, ref: 'Messages' }],
        // isGroupChat: { type: Boolean, default: false, required: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Conversations', Conversations);
