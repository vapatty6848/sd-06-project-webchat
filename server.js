const express = require('express');
const cors = require('cors');
const dateFormat = require('dateformat');

const PORT = 3000;
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const messagesDB = require('./models/messagesModel');
const usersDB = require('./models/usersModel');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

const usersList = [];

const findUser = (id, nickname) => {
  const detectUser = usersList.findIndex((user) => user.id === id);
  usersList.splice(detectUser, 1, { id, nickname });
};

const removeUser = (id) => {
  const detectUser = usersList.findIndex((user) => user.id === id);
  usersList.splice(detectUser, 1);
};

io.on('connection', (socket) => {
  socket.on('connectedUsers', ({ id, nickname }) => {
    usersList.push({ id, nickname });
    io.emit('connectedUsers', (usersList));
  });

  socket.on('changeNickname', ({ id, nickname }) => {
    findUser(id, nickname);
    io.emit('connectedUsers', (usersList));
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const dateAndTime = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
    const newMessage = `${dateAndTime} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMessage);
    messagesDB.createMessage({ message: chatMessage, nickname, timestamp: dateAndTime });
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    io.emit('connectedUsers', (usersList));
  });
});

app.get('/', async (_req, res) => {
  const messages = await messagesDB.getAllMessages();
  const users = await usersDB.getAllUsers();
  return res.render('home', { messages, users });
});

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));