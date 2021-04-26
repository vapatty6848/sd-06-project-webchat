const express = require('express');
const moment = require('moment');

const app = express();
const http = require('http');

const socketIoServer = http.createServer(app);
const cors = require('cors');
const socketIo = require('socket.io');

const { getAllMsg, postMsg } = require('./models/chatModel');

// const checkDate = () => {
//   const date = new Date();
//   const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}
//   ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
//   return formattedDate;
// };

const msgDate = () => {
  const dateFormatted = moment().format('DD-MM-yyyy h:mm:ss A');
  return dateFormatted;
};

const io = socketIo(socketIoServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const users = [];

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (_req, res) => {
  const message = await getAllMsg();

  res.render('home', { message, users });
});

const filterNickUser = ({ newNickname, socket }) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users[index].nickname = newNickname;
  console.log('users', users);
  io.emit('updateUsers', users);
};

io.on('connection', async (socket) => {
  socket.on('online-users', async (nickname) => {
    users.push({ id: socket.id, nickname });
    io.emit('updateUsers', users);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const newDate = msgDate();
    io.emit('message', `${newDate}-${nickname}:${chatMessage}`);
    await postMsg({ nickname, chatMessage, newDate });
  });

  socket.on('updateNickname', (newNickname) => {
    filterNickUser({ newNickname, socket });
  });

  socket.on('disconnect', () => {
  console.log(`user ${socket.id} disconnected`);
  const index = users.findIndex((user) => user.id === socket.id);
  users.splice(index, 1);
  io.emit('updateUsers', users);
  });
});

socketIoServer.listen(3000, () => console.log('listening on port 3000'));