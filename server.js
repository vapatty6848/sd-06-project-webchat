const express = require('express');
require('dotenv').config();

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

const userList = [];

function generateUserMessage(nickname, chatMessage) {
  const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
  const time = new Date().toLocaleTimeString();
  const userMessage = `${date} ${time} - ${nickname}: ${chatMessage}`;
  io.emit('message', userMessage);
}

function removeUserFromList(id) {
  const indexOfUser = userList.indexOf(id);
    userList.splice(indexOfUser, 1);
    io.emit('reloadUsersList', userList);
}

io.on('connection', (socket) => {
  console.log('Conectado');
  userList.push(socket.id);
  
  socket.on('userConnected', () => {
    io.emit('reloadUsersList', userList);
  });
  
  socket.on('disconnect', () => {
    removeUserFromList(socket.id);
    console.log('Desconectado');
  });
  
  socket.on('userChangedName', (nick) => {
    const indexOfUser = userList.indexOf(socket.id);
    userList[indexOfUser] = nick;
    io.emit('reloadUsersList', userList);
  });
  
  socket.on('message', ({ nickname, chatMessage }) => {
    generateUserMessage(nickname, chatMessage);
  });
});

const chatController = require('./controllers/chatController');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, '/views/')));

app.use('/', chatController);

http.listen(process.env.PORT, () => console.log('Server open...'));
