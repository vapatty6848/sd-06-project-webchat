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
const Messages = require('./models/Messages');
const {
  handleNewConnection,
  sendChatMessage,
  handleClientDisconnection,
  handleNicknameChange,
} = require('./utils');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', './views');

const LOCALHOST_PORT = 3000;
const PORT = process.env.PORT || LOCALHOST_PORT;

app.get('/', async (request, response) => {
  const messages = await Messages.getAll();
  console.log('Database messages:', messages);
  return response.status(200).render('chat', { messages });
});

const users = [];

io.on('connection', (socket) => {
  // Client connection
  handleNewConnection({ socket, users, io });

  // Get message sent from client
  socket.on('message', ({ chatMessage, nickname }) => {
    sendChatMessage({ chatMessage, nickname, io });
  });

  // Change nickname
  socket.on('nickname.change', ({ socketId, newNickname }) => {
    handleNicknameChange({ socket, socketId, newNickname, io });
  });

  // Client disconects
  socket.on('disconnect', () => {
    handleClientDisconnection({ socket, users, io });
  });
});

module.exports.users = users;
httpServer.listen(PORT, () => { console.log(`Ouvindo a porta ${PORT}`); });
