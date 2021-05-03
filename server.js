const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const ChatController = require('./controllers/ChatController');
const {
  handleNewConnection,
  handleMessageSent,
  handleClientDisconnection,
  handleNicknameChange,
} = require('./utils');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', './views');

const LOCALHOST_PORT = 3000;
const PORT = process.env.PORT || LOCALHOST_PORT;

app.get('/', ChatController);

io.on('connection', (socket) => {
  // Client connection
  socket.on('newConnection', (userNickname) => {
    handleNewConnection({ socket, io, userNickname });
  });

  // Get message sent from client
  socket.on('message', ({ chatMessage, nickname }) => {
    handleMessageSent({ io, chatMessage, nickname });
  });

  // Change nickname
  socket.on('nickname.change', ({ socketId, newNickname }) => {
    handleNicknameChange({ socket, socketId, newNickname, io });
  });

  // Client disconects
  socket.on('disconnect', () => {
    handleClientDisconnection({ socket, io });
  });
});

httpServer.listen(PORT, () => { console.log(`Ouvindo a porta ${PORT}`); });
