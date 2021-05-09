// Faça seu código aqui
const express = require('express');
const { saveMessage, getMessages, getUsers } = require('./models/messagesModel');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.set('view engine', 'ejs');

app.use('/', express.static(__dirname));

const users = [];

io.on('connection', (socket) => {
  const now = new Date();
  const date = `${now.getDate()}-${(now.getMonth() + 1)}-${now.getFullYear()}`;
  const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  console.log(`${socket.id} logged in at ${date} ${time}`);
  users.push({
    id: socket.id,
    nickname: socket.id.slice(0, 16),
  });
  io.emit('name', socket.id);
  socket.on('disconnect', () => {
    console.log('Someone logged off');
    users.splice(users.indexOf(socket.id), 1);
    console.log(users);
  });
  socket.on('list', () => {
    const arrayNickname = users.map((user) => user.nickname);
    io.emit('list', arrayNickname);
  })
  socket.on('message', ({ chatMessage, nickname }) => {
    console.log('oi');
    users.forEach((user) => {
      if(user.id === socket.id && user.nickname === socket.id.slice(0, 16)) {
        user.nickname = nickname;
      }
    });
    users.forEach(async (user) => {
      if(user.id === socket.id) {
        io.emit('message', `${date} ${time} - ${user.nickname}: ${chatMessage}`);
        await saveMessage(chatMessage, user.nickname, `${date} ${time}`);
      }
    });
    
  });
  socket.on('changeNick', (nickname) => {
    console.log('aqui')
    users.forEach((user) => {
      if(user.id === socket.id) {
        user.nickname = nickname;
      }
    });
    console.log(users);
  })
});

app.get('/', async (req, res) => {
  const savedMessages = await getMessages();
  const savedUsers = await getUsers();
  res.render('home/index', { savedMessages, savedUsers });
});

httpServer.listen(3000, () => console.log('Lister in port 3000'));
