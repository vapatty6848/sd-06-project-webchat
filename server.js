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

const sendMsg = async (msg) => {
  await Messages.create(
    { nickname: msg.nickname, chatMessage: msg.chatMessage, timestamp: currDate },
    );
    io.emit('message', `${currDate} ${msg.nickname} ${msg.chatMessage}`);
  };
  
  const newLogin = (socket, currUser) => {
    allUsers.push(currUser);
    socket.broadcast.emit('usersList', allUsers);
    const filterUsers = allUsers.filter((e) => e !== currUser);
    socket.emit('usersList', [currUser, ...filterUsers]);
  };

io.on('connection', (socket) => {
  let currUser;
  socket.on('users', (user) => {
    currUser = user;
    newLogin(socket, currUser);
  });
  
  socket.on('disconnect', () => {
    const updateUsers = allUsers.filter((e) => e !== currUser);
    allUsers = updateUsers;
    io.emit('usersList', updateUsers);
  });
  
  socket.on('updateNickname', (nickname) => {
    const index = allUsers.indexOf(currUser);
    allUsers[index] = nickname;
    currUser = nickname;
    io.emit('usersList', allUsers);
  });
});

io.on('connection', (socket) => {
  socket.on('message', async (msg) => {
    sendMsg(msg);
  });
});

http.listen(3000);