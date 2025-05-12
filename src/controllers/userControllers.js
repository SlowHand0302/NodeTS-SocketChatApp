const { Users } = require('../models');

// api/user/create
module.exports.POST_CreateNew = async (req, res, next) => {
    const { email } = req.body;
    const isExist = Users.find({ email: email });
    if (isExist) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Email đã tồn tại trong hệ thống',
        });
    }

    return await Users.create({ ...req.body })
        .then((user) => {
            return res.status(200).json({
                success: true,
                message: 'Tạo tài khoản thành công',
                data: user,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err,
            });
        });
};

// api/user/read/:_id
module.exports.GET_OneUser = async (req, res, next) => {
    const { _id } = req.params;
    return await Users.findOne({ _id })
        .select('_id name username email phoneNumb role')
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: `Not found ${_id}`,
                });
            }
            return res.status(200).json({
                success: true,
                message: 'User is found',
                user,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err,
            });
        });
};

// api/user/read
module.exports.GET_ReadMany = async (req, res, next) => {
    return await Users.find({})
        .select('_id name username email phoneNumb')
        .then((users) => {
            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Empty Database',
                });
            }
            return res.status(200).json({
                success: true,
                message: `Found ${users.length} users`,
                users,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err,
            });
        });
};

// api/user/:_id/search?username
module.exports.GET_SearchUser = async (req, res, next) => {
    const { username } = req.query;
    const { _id } = req.params;
    return await Users.find({ username: { $regex: username, $options: 'i' }, _id: { $ne: _id } })
        .select('username')
        .limit(10)
        .then((users) => {
            if (!users) {
                return res.status(404).json({
                    success: false,
                    message: 'Not found any users',
                });
            }
            return res.status(200).json({
                success: true,
                users,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                error,
            });
        });
};

// api/user/:_id/updateProfile
module.exports.PUT_UserProfile = async (req, res, next) => {
    const { _id } = req.params;
    try {
        const user = await Users.findById(_id);
        if (!user) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Not found any user',
            });
        }

        const userUpdated = await Users.findByIdAndUpdate({ _id }, { ...req.body }, { returnOriginal: false });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update user profile success',
            user: userUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: error.message,
        });
    }
};

