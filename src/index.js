require('dotenv').config();
const SOCKET_PORT = process.env.SOCKET_PORT;
const SERVER_URL = process.env.SERVER_URL;
const CLIENT_URL = process.env.CLIENT_URL;

const http = require('http');
const { Server } = require('socket.io');

const app = require('./config/server').init();
const db = require('./config/database');

const httpServer = http.createServer(app);
const routers = require('./routers/index');
const { messageHandlers, roomHandlers } = require('./socketHandlers');

db.connect();

const io = new Server(httpServer, {
    cors: {
        origin: CLIENT_URL,
        methods: ['GET', 'POST'],
    },
});

app.use('/api', routers);

app.get('/', (req, res) => {
    return res.json('Socket Website');
});

io.on('connection', (socket) => {
    console.log(`${socket.id} joined our server`);

    socket.emit('receive_msg', {
        id: 'admin',
        sender: 'Admin',
        receiver: 'everyone',
        message: 'Welcome To My Website',
    });

    messageHandlers(socket, io);
    roomHandlers(socket, io);

    socket.on('disconnect', () => {
        console.log(`${socket.id} left our server`);
    });
});

httpServer.listen(SOCKET_PORT, () => {
    console.log(`Server is running on ${SOCKET_PORT}: ${SERVER_URL}`);
});
