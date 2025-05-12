const { userControllers } = require('../controllers');
const authentication = require('../middlewares/authentication');
const express = require('express');
const routers = express.Router();

routers.post('/create', userControllers.POST_CreateNew);
routers.get('/read/:_id', userControllers.GET_OneUser);
routers.get('/read', userControllers.GET_ReadMany);
routers.post('/login', authentication.POST_Login);
routers.get('/:_id/search', userControllers.GET_SearchUser);
routers.put('/:_id/updateProfile', userControllers.PUT_UserProfile);

module.exports = routers;
