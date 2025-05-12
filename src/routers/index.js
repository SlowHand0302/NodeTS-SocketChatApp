const routers = require('express').Router();
const authentication = require('../middlewares/authentication');
const userRouters = require('./userRouters');
const messageRouters = require('./messageRouters');
const conversationRouters = require('./conversationsRouters');
const oauthRouters = require('./OAuthRouters');

routers.use('/user', userRouters);
routers.use('/message', messageRouters);
routers.use('/conversation', conversationRouters);
routers.use('/oauth', oauthRouters);

routers.get('/', (req, res, next) => {
    return res.send('API Server Of Socket Website');
});

module.exports = routers;
