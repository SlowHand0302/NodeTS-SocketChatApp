function messageHandlers(socket, io) {
    socket.on('sendMsg', (arg) => {
        // socket.broadcast.emit('receive_msg', arg);
        socket.broadcast.to(arg.roomName).emit(`receiveMessage:${arg.roomName}`, arg.message);
        console.log(socket.id + ' send to room ' + arg.roomName + ' ' + arg?.message.contents);
    });

    socket.on('updateConversationList', (arg) => {
        console.log('update conversation list ' + arg);
        io.emit('updateConversationList', arg);
    });
}

module.exports = messageHandlers;
