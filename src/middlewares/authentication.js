require('dotenv').config();
const { Users } = require('../models');
const jwt = require('jsonwebtoken');

module.exports.POST_Login = async (req, res, next) => {
    const { email, password } = req.body;
    return await Users.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Not found any user',
            });
        }
        const isValidPassword = user.password === password;
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                msg: 'Wrong Password',
            });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: 86400 });
        // res.cookie('accessToken', token, {
        //     httpOnly: true,
        //     maxAge: 86400,
        // });
        return res.status(200).json({
            success: true,
            msg: 'Login Success',
            token,
            user: {
                _id: user._id,
                username: user.username,
            },
        });
    });
};

module.exports.VerifyAuth = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({
            auth: false,
            msg: 'No token provided',
        });
    }

    jwt.verify(token.split('Bearer ')[1], process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({
                auth: false,
                err,
            });
        }
        if (Math.floor(Date.now() / 1000) > decoded.exp) {
            return res.status(401).json({
                auth: false,
                msg: 'Your login session expired',
            });
        }
        req._id = decoded.id;
        next();
    });
};

