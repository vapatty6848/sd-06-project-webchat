const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const fetch = require('node-fetch');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

let userList = [];
let myNickname = '';

const saveMessageInDB = (message) => fetch('http://localhost:3000/', {
    method: 'POST',
    body: JSON.stringify({ message }),
    headers: { 'Content-type': 'application/json' },
  });

function generateUserMessage(chatMessage, nickname) {
  const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
  const time = new Date().toLocaleTimeString();
  const timestamp = `${date} ${time}`;
  
  const message = `${timestamp} ${nickname} ${chatMessage}`;
  saveMessageInDB(message);
  
  io.emit('message', message);
  // socket.broadcast.emit('reload');
}

function removeUserFromList(id) {
  const indexOfUser = userList.indexOf(id);
  // console.log(userList);
  // console.log(id);
  // console.log(userList.indexOf(id));
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
  // console.log(newUserList);
}

function onDisconnect(socket, myNick) {
  removeUserFromList(myNick);
    socket.broadcast.emit('createListForOthers', userList);
    socket.broadcast.emit('addClassOnTop', { userList });
    console.log('Usuário desconectado');
}

io.on('connection', (socket) => {
  console.log('Conectado');
  
  socket.on('userConnected', (nick) => {
    myNickname = nick;
    userConnected(socket, nick);
  });
  
  socket.on('updateUserList', (newUserList) => {
    updateUserList(newUserList);
  });
  
  socket.on('disconnect', () => {
    const myNick = socket.id.substr(1, 16);
    onDisconnect(socket, myNick);
  });
  
  socket.on('userChangedName', ({ oldNick, nick }) => {
    nameChange(socket, oldNick, nick);
  });
  
  socket.on('message', ({ chatMessage, nickname }) => {
    generateUserMessage(chatMessage, nickname);
  });
});

const chatController = require('./controllers/chatController');
const usersController = require('./controllers/usersController');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, '/views/')));

app.use('/', chatController);
app.use('/users', usersController);
app.use(express.json());

http.listen(process.env.PORT || 3000, () => console.log('Server open...'));
