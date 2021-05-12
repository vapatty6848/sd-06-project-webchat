const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const dateFormat = require('dateformat');

const cors = require('cors');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const messagesModel = require('./models/messagesModel');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());

app.get('/', async (req, res) => {
  const history = await messagesModel.getAllMessages();
  res.render('home', { history });
});

const now = new Date();
const fullData = String(dateFormat(now, 'dd-mm-yyyy HH:MM:ss TT'));

const onlineUsers = [];

const userDisconnect = (socket, users) => {
  const userDiconnect = users.findIndex((user) => user.id === socket.id);
  onlineUsers.splice(userDiconnect, 1);
};

io.on('connection', (socket) => {
  socket.on('message', async ({ nickname, chatMessage }) => {
    io.emit('message', `${fullData} - ${nickname}: ${chatMessage}`);
    messagesModel.createHistory(nickname, chatMessage, fullData);
  });

  socket.on('newUser', (nickname) => {
    onlineUsers.unshift({ id: socket.id, nickname });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('changingNickname', (nickname) => {
    const findUser = onlineUsers.findIndex((user) => user.id === socket.id);
    onlineUsers.splice(findUser, 1, { id: socket.id, nickname });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('disconnect', () => {
    userDisconnect(socket, onlineUsers);
    io.emit('onlineUsers', onlineUsers);
  });
});

httpServer.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});