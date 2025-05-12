const { conversationControllers } = require('../controllers');
const routers = require('express').Router();

routers.post('/create', conversationControllers.POST_CreateNew);
routers.get('/singleConversation', conversationControllers.GET_ReadSingleConversation);
routers.get('/read/:userId', conversationControllers.GET_ReadManyByUser);
routers.get('/readOne/:_id', conversationControllers.GET_ReadOne);
routers.put('/addMessage/:_id', conversationControllers.PUT_UpdateMessage);
routers.delete('/delete/:_id', conversationControllers.DELETE_RemoveGroupChat);

// api/conversation/count?conversationId=:conversationId&state=:state
routers.get('/count', conversationControllers.GET_CountMessageByState);

module.exports = routers;
