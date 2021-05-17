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

let users = [];

const now = new Date();
const date = `${now.getDate()}-${(now.getMonth() + 1)}-${now.getFullYear()}`;
const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

const socketOnDisconnect = (socket) => {
  io.emit('removeUser', socket.id);
  users = users.filter((item) => item.id !== socket.id);
  console.log(users);
};

const socketOnMessage = ({ chatMessage, nickname, socket }) => {
    users.forEach((user) => {
      if (user.id === socket.id && user.nickname === socket.id.slice(0, 16)) {
        user.nickname = nickname;
      }
    });
    users.forEach(async (user) => {
      if (user.id === socket.id) {
        io.emit('message', `${date} ${time} - ${user.nickname}: ${chatMessage}`);
        await saveMessage(chatMessage, user.nickname, `${date} ${time}`);
      }
    });
};

const socketOnNickname = ({ socket, nickname }) => {
  users.forEach((user) => {
    if (user.id === socket.id) {
      io.emit('removeUser', socket.id);
      user.nickname = nickname;
      io.emit('addUser', user);
    }
  });
};

io.on('connection', async (socket) => {
  users.push({ id: socket.id, nickname: socket.id.slice(0, 16) });
  io.emit('name', socket.id);
  users.forEach((user) => {
    if (user.id === socket.id) io.emit('addUser', user);
  });
  io.emit('listUpdate', users);
  socket.on('disconnect', () => socketOnDisconnect(socket));
  socket.on('message', ({ chatMessage, nickname }) => 
    socketOnMessage({ socket, chatMessage, nickname }));
  socket.on('changeNick', (nickname) => socketOnNickname({ socket, nickname }));
});

app.get('/', async (req, res) => {
  const savedMessages = await getMessages();
  res.render('home/index', { savedMessages });
});

httpServer.listen(3000, () => console.log('Lister in port 3000'));
