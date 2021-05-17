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
};

const socketOnMessage = ({ chatMessage, nickname }) => {
  io.emit('message', `${date} ${time} - ${nickname}: ${chatMessage}`);
  saveMessage(chatMessage, nickname, `${date} ${time}`);
};

const socketOnNickname = ({ socket, nickname }) => {
  const index = users.findIndex((item) => item.id.includes(socket.id));
  io.emit('removeUser', socket.id);
  users[index].nickname = nickname;
  io.emit('addUser', { id: socket.id, nickname });
};

io.on('connection', async (socket) => {  
  socket.on('userOnline', (nickName) => {
    users.push({ id: socket.id, nickname: nickName });
    io.emit('name', socket.id);
    users.forEach((user) => {
      if (user.id === socket.id) io.emit('addUser', user);
    });
    io.emit('listUpdate', users);
  }); 
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
