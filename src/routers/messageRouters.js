const { messageControllers } = require('../controllers');
const routers = require('express').Router();
const { upload } = require('../middlewares/multer');

routers.post('/create', messageControllers.POST_CreateNew);
routers.get('/read/:conversation', messageControllers.GET_ReadManyByConversation);
routers.post('/upload', upload.single('file'), messageControllers.POST_MessaggeAsFile);

module.exports = routers;
