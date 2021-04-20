const express = require('express');
const cors = require('cors');
const path = require('path');
const moment = require('moment');

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
  handleClientDisconnection,
  handleNicknameChange,
  formatChatMessage,
} = require('./utils');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', './views');

const LOCALHOST_PORT = 3000;
const PORT = process.env.PORT || LOCALHOST_PORT;

app.get('/', async (request, response) => {
  const retrievedMessages = await Messages.getAll();
  const messages = retrievedMessages.map(({ message, nickname, timestamp }) => (
    `${timestamp} - ${nickname}: ${message}`
  ));
  console.log('Database messages:', messages);

  return response.status(200).render('chat', { messages });
});

const users = [];

io.on('connection', (socket) => {
  // Client connection
  socket.on('newConnection', (userNickname) => {
    users.push({ socketId: socket.id, nickname: userNickname });
    console.log('Usuário conectado, lista de usuários: ', users);
    io.emit('usersUpdate', users);
  });

  // Get message sent from client
  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-YYYY HH:mm:ss');
    const formattedMessage = formatChatMessage({ chatMessage, nickname, timestamp });
    await Messages.create(chatMessage, nickname, timestamp);
    // await saveChatMeesage({ chatMessage, nickname, timestamp });
    io.emit('message', formattedMessage);
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

module.exports.users = users;
httpServer.listen(PORT, () => { console.log(`Ouvindo a porta ${PORT}`); });
