function roomHandlers(socket, io) {
    socket.on('joinRoom', (arg) => {
        socket.join(arg);
        console.log(socket.id + ' joined room: ' + arg);
    });
}

module.exports = roomHandlers;