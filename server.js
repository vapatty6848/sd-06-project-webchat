const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

let userList = [];

function generateUserMessage(chatMessage, nickname, socket) {
  const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
  const time = new Date().toLocaleTimeString();
  const timestamp = `${date} ${time}`;
  
  const userMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
  
  socket.emit('message', userMessage);
  io.emit('reload');
}

function removeUserFromList(id) {
  const indexOfUser = userList.indexOf(id);
    userList.splice(indexOfUser, 1);
    io.emit('reloadUsersList', userList);
}

function nameChange(socket, oldNick, nick) {
  const indexOfUser = userList.indexOf(oldNick);
    userList[indexOfUser] = nick;
    
    socket.emit('createUserList', { nick, userList });
    socket.broadcast.emit('createListForOthers', userList);
    // socket.emit('putUserOnTop', userList);
    // socket.broadcast.emit('reloadUsersList', userList);
}

function userConnected(socket, nick) {
  userList.push(nick);
    socket.emit('createUserList', { nick, userList });
    socket.broadcast.emit('createListForOthers', userList);
    // socket.broadcast.emit('reloadUsersList', userList);
}

function updateUserList(newUserList) {
  userList = newUserList;
  console.log(newUserList);
}

function onDisconnect(nick, socket) {
  removeUserFromList(socket.id);
    socket.broadcast.emit('createListForOthers', userList);
    socket.broadcast.emit('addClassOnTop', { nick, userList });
    console.log('Desconectado');
}

io.on('connection', (socket) => {
  console.log('Conectado');
  
  socket.on('userConnected', (nick) => {
    userConnected(socket, nick);
  });
  
  socket.on('updateUserList', (newUserList) => {
    updateUserList(newUserList);
  });
  
  socket.on('disconnect', (nick) => {
    onDisconnect(nick, socket);
  });
  
  socket.on('userChangedName', ({ oldNick, nick }) => {
    nameChange(socket, oldNick, nick);
  });
  
  socket.on('message', ({ chatMessage, nickname }) => {
    generateUserMessage(chatMessage, nickname, socket);
  });
});

const chatController = require('./controllers/chatController');
const usersController = require('./controllers/usersController');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, '/views/')));

app.use('/', chatController);
app.use('/users', usersController);

http.listen(process.env.PORT || 3000, () => console.log('Server open...'));
