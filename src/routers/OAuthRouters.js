const routers = require('express').Router();
const { oauthControllers } = require('../controllers');

routers.post('/login/google', oauthControllers.POST_LoginGoogle);

module.exports = routers;
