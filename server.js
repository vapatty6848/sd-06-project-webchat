/* eslint-disable max-lines-per-function */
const app = require('express')();
const http = require('http').createServer(app);
const dateFormat = require('dateformat');

const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const Messages = require('./models/messageModel');

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (_req, res) => {
  const msg = await Messages.getAll();
  res.status(200).render('index', { msg });
});

const currDate = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss');

let allUsers = [];

const newLogin = (socket, currUser) => {
  allUsers.push(currUser);
  socket.broadcast.emit('usersList', allUsers);
  const filtered = allUsers.filter((el) => el !== currUser);
  socket.emit('usersList', [currUser, ...filtered]);
};

const sendMsg = async (msg) => {
  await Messages.create(
    { nickname: msg.nickname, chatMessage: msg.chatMessage, timestamp: currDate },
);
  io.emit('message', `${currDate} - ${msg.nickname}: ${msg.chatMessage}`);
};

io.on('connection', (socket) => {
  let currUser;
  socket.on('users', (user) => {
    currUser = user;
    newLogin(socket, currUser);
  });

  socket.on('disconnect', () => {
    const updateUsers = allUsers.filter((el) => el !== currUser);
    allUsers = updateUsers;
    io.emit('usersList', updateUsers);
  });

  socket.on('updateNickname', (nickname) => {
    const idx = allUsers.indexOf(currUser);
    allUsers[idx] = nickname;
    currUser = nickname;
    io.emit('usersList', allUsers);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const dbMsg = await Messages.create(chatMessage, nickname, currDate);
    io.emit('message', `${dbMsg.timestamp} ${dbMsg.nickname}: ${dbMsg.message}`);
  });
});

io.on('connection', (socket) => {
  socket.on('message', async (msg) => {
    sendMsg(msg);
  });
});

http.listen(3000);