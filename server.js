const path = require('path');
const app = require('express')();
const httpServer = require('http').createServer(app);
const cors = require('cors');

const PORT = 3000;
app.use(cors());

const io = require('socket.io')(httpServer, {
    cors: {
        origin: process.env.BASE_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
const MessagesModel = require('./models/Messages');

app.get('/', (_req, res) => {
    const pathHTML = path.join(__dirname, 'views', '/index.html');
    res.sendFile(pathHTML);
});

const time = new Date();
const timeString = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
  .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

  // Requisito 1
  const messageSocket = async (socket) => {
    socket.on('message', async ({ chatMessage, nickname }) => {
      await MessagesModel.create(timeString, nickname, chatMessage);
      io.emit('message', `${timeString} ${nickname} ${chatMessage}`);
    });
  };

io.on('connection', (socket) => {
    console.log(`socketId: ${socket.id} conected!`);
    messageSocket(socket);
});

httpServer.listen(PORT, () => console.log(`for whom the bells tolls ${PORT}`));