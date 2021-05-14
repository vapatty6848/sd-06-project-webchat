const express = require('express');

const app = express();
const server = require('http').createServer(app);

const cors = require('cors');
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

const Model = require('./models/Messages');
const messageController = require('./controllers/messagesController');

const PORT = 3000;

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/', messageController);

  const enviaMensagem = async (chatMessage, nickname) => {
    const date = new Date().toLocaleString().replace(/\//g, '-');
    const message = `${date} ${chatMessage}: ${nickname}`;
    await Model.saveMessage(chatMessage, nickname, date);
    io.emit('message', message);
  };

  io.on('connection', (socket) => {
    socket.on('message', ({ chatMessage, nickname }) => enviaMensagem(chatMessage, nickname));
  });

server.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
});