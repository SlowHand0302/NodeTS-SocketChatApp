require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const { Users } = require('../models');
const jwt = require('jsonwebtoken');

// api/oauth/login/google
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');

module.exports.POST_LoginGoogle = async (req, res, next) => {
    const { code } = req.body;
    try {
        const response = await oAuth2Client.getToken(code);
        const token = response.tokens;
        const ticket = await oAuth2Client
            .verifyIdToken({
                idToken: token.id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            .then((ticket) => ticket)
            .catch((error) => console.log(error));
        const payload = ticket.payload;
        const isExisted = await Users.findOne({ email: payload.email });

        if (isExisted.length === 0) {
            const user = await Users.create({ fullname: payload.name, username: payload.email, email: payload.email });
            if (user) {
                const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, {
                    expiresIn: 86400,
                });
                return res.status(200).json({
                    success: true,
                    msg: 'Login Success',
                    token,
                    user: {
                        _id: user._id,
                        username: user.username,
                    },
                });
            }
        }

        return res.status(200).json({
            code: 200,
            success: true,
            token: jwt.sign({ id: isExisted._id, username: isExisted.username }, process.env.SECRET_KEY, {
                expiresIn: 86400,
            }),
            user: {
                _id: isExisted._id,
                username: isExisted.username,
            },
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            error,
        });
    }
};
