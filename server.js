const express = require('express');

const app = express();

const http = require('http');

const socketIoServer = http.createServer(app);

const cors = require('cors');

const socketIo = require('socket.io');

const { getAllMsg, postMsg } = require('./models/chatModel');

const checkDate = () => {
  const date = new Date();
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}
  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return formattedDate;
};

const io = socketIo(socketIoServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let users = [];
const newUsersChat = ({ newUserNick, socket }) => {
  const nickUser = users.map((user) => {
    if (user.socketId !== socket.id) return user;
    return { ...user, nickname: newUserNick };
  });

  users = nickUser;
  io.emit('new users', { users });
};

app.use(cors());

io.on('connection', (socket) => {
  const randomName = `user_${Math.random().toString().substr(2, 11)}`;
  const newUser = { socketId: socket.id, name: randomName };
  users.push(newUser);
  io.emit('new users', users);
  socket.on('message', ({ nickname, chatMessage }) => {
    const newDate = checkDate();
    postMsg({ nickname, chatMessage, newDate });
    const message = `${newDate} ${nickname}${chatMessage}`;
    io.emit('message', message);
  });

  socket.on('new users', (newNickName) => {
    newUsersChat({ newNickName, socket });
  });

  socket.on('disconnect', () => {
    const activeUsers = users.filter((user) => user.socketId !== socket.id);
    users = activeUsers;
    io.emit('new users', users);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (_req, res) => {
  const getAll = await getAllMsg();

  res.render('front', getAll);
});

socketIoServer.listen(3000, () => console.log('listening on port 3000'));