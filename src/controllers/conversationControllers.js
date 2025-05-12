const { Conversations } = require('../models');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// api/conversation/create
module.exports.POST_CreateNew = async (req, res, next) => {
    return Conversations.create({ ...req.body })
        .then((conversation) => {
            return res.status(200).json({
                success: true,
                conversation,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                error,
            });
        });
};

// api/conversation/read/:userId
module.exports.GET_ReadManyByUser = async (req, res, next) => {
    const { userId } = req.params;
    return Conversations.aggregate([
        {
            $match: { members: { $in: [new ObjectId(userId)] } },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'admins',
                foreignField: '_id',
                pipeline: [{ $project: { _id: 1, username: 1 } }],
                as: 'admins',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                pipeline: [{ $project: { _id: 1, username: 1 } }],
                as: 'members',
            },
        },
        {
            $lookup: {
                from: 'messages',
                localField: 'messages',
                foreignField: '_id',
                pipeline: [
                    { $project: { _id: 1, contents: 1, createdAt: 1, type: 1, sender: 1, state: 1 } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 1 },
                ],
                as: 'messages',
            },
        },
        {
            $sort: {
                updatedAt: -1,
            },
        },
    ])
        .then((conversations) => {
            if (!conversations) {
                return res.status(404).json({
                    success: false,
                    msg: 'Not found any conversations',
                });
            }
            return res.status(200).json({
                success: true,
                conversations,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                error,
            });
        });
};

// api/conversation/readOne/:_id
module.exports.GET_ReadOne = async (req, res, next) => {
    const { _id } = req.params;
    return Conversations.findById(_id)
        .populate([
            {
                path: 'admins',
                select: 'username',
            },
            {
                path: 'members',
                select: 'username',
            },
            {
                path: 'messages',
                select: 'contents createdAt',
                options: {
                    sort: { createdAt: -1 },
                    limit: 1,
                },
            },
        ])
        .then((conversation) => {
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    msg: 'Not found any conversation',
                });
            }
            return res.status(200).json({
                success: true,
                conversation,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                error,
            });
        });
};

// api/conversation/addMessage/:_id
module.exports.PUT_UpdateMessage = async (req, res, next) => {
    const { _id } = req.params;
    const { messages } = req.body;
    try {
        const conversation = await Conversations.findById(_id).select('messages');
        if (!conversation) {
            return res.status(404).json({
                success: false,
                msg: 'Not found any conversation',
            });
        }

        let updatedConversation;
        if (typeof messages === 'string') {
            updatedConversation = await Conversations.findByIdAndUpdate(
                { _id },
                { messages: [...conversation.messages, messages] },
                { returnOriginal: false },
            );
        } else {
            updatedConversation = await Conversations.findByIdAndUpdate(
                { _id },
                { messages: [...conversation.messages, messages] },
                { returnOriginal: false },
            );
        }
        return res.status(200).json({
            success: true,
            conversation: updatedConversation,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

// api/conversation/delete/:_id
module.exports.DELETE_RemoveGroupChat = async (req, res, next) => {
    const { _id } = req.params;
    return Conversations.findByIdAndDelete(_id)
        .then(() => {
            return res.status(200).json({
                success: true,
                msg: 'Delete completed',
            });
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                error,
            });
        });
};

// api/conversation/read/singleConversation
module.exports.GET_ReadSingleConversation = async (req, res, next) => {
    const { members } = req.query;

    return await Conversations.find({ members: { $size: 2, $all: members } })
        .then((conversations) => {
            if (!conversations) {
                return res.status(404).json({
                    success: false,
                    msg: 'Not found any conversations',
                });
            }

            return res.status(200).json({
                success: true,
                conversations,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                err,
            });
        });
};

// api/conversation/count?conversationId=:conversationId&state=:state
module.exports.GET_CountMessageByState = async (req, res, next) => {
    const { _id, messageState } = req.query;
    return await Conversations.aggregate([
        {
            $match: {
                _id: new ObjectId(_id),
            },
        },
        {
            $lookup: {
                from: 'messages',
                localField: 'messages',
                foreignField: '_id',
                pipeline: [{ $project: { sender: 1, state: 1 } }, { $match: { state: messageState } }],
                as: 'messages',
            },
        },
    ])
        .then((conversation) => {
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    msg: 'Not found any conversation',
                });
            }
            return res.status(200).json({
                success: true,
                conversation,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                error,
            });
        });
};
