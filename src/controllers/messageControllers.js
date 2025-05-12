const { Messages } = require('../models');
const axios = require('axios');
require('dotenv').config();
const SERVER_URL = process.env.SERVER_URL;

// api/message/create
module.exports.POST_CreateNew = async (req, res, next) => {
    return await Messages.create({ ...req.body })
        .then(async (message) => {
            const options = {
                url: `${SERVER_URL}/api/conversation/addMessage/${message.conversation}`,
                method: 'PUT',
                data: {
                    messages: message.id,
                },
            };
            try {
                const response = await axios.request(options);
                const result = response.data;
                return res.status(200).json({
                    success: true,
                    message,
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    error,
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                error,
            });
        });
};

// api/message/read/:conversation
module.exports.GET_ReadManyByConversation = async (req, res, next) => {
    const { conversation } = req.params;
    const { page, pageSize = 10 } = req.query;

    return Messages.find({ conversation })
        .populate({ path: 'sender', select: 'username' })
        .sort({ createdAt: -1 })
        .skip(page * pageSize)
        .limit(pageSize)
        .then((messages) => {
            if (!messages) {
                return res.status(404).json({
                    success: false,
                    msg: 'Not Found any conversation',
                });
            }
            return res.status(200).json({
                success: true,
                messages: messages,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                error,
            });
        });
};

// api/message/upload
module.exports.POST_MessaggeAsFile = async (req, res, next) => {
    const file = req.file;
    const { type } = req.body;

    if (!file) {
        return res.status(404).json({
            success: false,
            msg: 'File not found',
        });
    }

    return await Messages.create({
        ...req.body,
        contents:
            type === 'image' || type === 'video'
                ? process.env.SERVER_URL + '/uploads/' + file.filename
                : JSON.stringify(file),
    })
        .then(async (message) => {
            const options = {
                url: `${SERVER_URL}/api/conversation/addMessage/${message.conversation}`,
                method: 'PUT',
                data: {
                    messages: message.id,
                },
            };
            try {
                const response = await axios.request(options);
                const result = response.data;
                return res.status(200).json({
                    success: true,
                    message,
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    error,
                });
            }
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                err,
            });
        });
};

