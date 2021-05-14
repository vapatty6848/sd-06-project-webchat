const express = require('express');

const app = express();

const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const {
  saveMessage,
  getMessages,
  } = require('./models/messagesModel');

app.set('view engine', 'ejs');

app.use('/', express.static(__dirname));

const users = [];

const now = new Date();
const date = `${now.getDate()}-${(now.getMonth() + 1)}-${now.getFullYear()}`;
const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

const socketOnDisconnect = (socket) => {
  socket.on('disconnect', () => {
    users.forEach((user) => {
      if (user.id === socket.id) {
        io.emit('removeUser', user.nickname);
      }
    });
    users.splice(users.indexOf(socket.id), 1);
  });
};

const socketOnMessage = (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    users.forEach((user) => {
      if (user.id === socket.id && user.nickname === socket.id.slice(0, 16)) {
        user.nickname = nickname;
      }
    });
    users.forEach((user) => {
      if (user.id === socket.id) {
        io.emit('message', `${date} ${time} - ${user.nickname}: ${chatMessage}`);
        saveMessage(chatMessage, user.nickname, `${date} ${time}`);
      }
    });
  });
};

io.on('connection', async (socket) => {
  users.push({ id: socket.id, nickname: socket.id.slice(0, 16) });
  io.emit('name', socket.id);
  users.forEach((user) => {
    if (user.id === socket.id) io.emit('addUser', user.nickname);
  });
  // const listOfNicknames = users.map((user) => user.nickname);
  io.emit('listUpdate', users);
  socketOnDisconnect(socket);
  socketOnMessage(socket);
  socket.on('changeNick', (nickname) => {
    users.forEach((user) => {
      if (user.id === socket.id) {
        io.emit('removeUser', user.nickname);
        io.emit('addUser', nickname);
        user.nickname = nickname; 
      }
    });
  });
});

app.get('/', async (req, res) => {
  const savedMessages = await getMessages();
  res.render('home/index', { savedMessages });
});

httpServer.listen(3000, () => console.log('Lister in port 3000'));
