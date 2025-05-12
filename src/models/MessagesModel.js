const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema(
    {
        sender: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },
        conversation: { type: mongoose.Types.ObjectId, ref: 'Conversations', required: true },
        contents: { type: String, required: true },
        state: { type: String, enums: ['seen', 'unseen', 'removed'] },
        type: { type: String, ennums: ['image', 'video', 'file', 'text'] },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Messages', Messages);
