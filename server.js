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

const userList = [];

io.on('connection', (socket) => {
  console.log('Conectado');
  
  userList.push(socket.id);
  
  socket.on('userConnected', () => {
    io.emit('reloadUsersList', userList);
  });
  
  socket.on('disconnect', () => {
    const indexOfUser = userList.indexOf(socket.id);
    userList.splice(indexOfUser, 1);
    io.emit('reloadUsersList', userList);
    console.log('Desconectado');
  });
  
  socket.on('userChangedName', (nick) => {
    const indexOfUser = userList.indexOf(socket.id);
    userList[indexOfUser] = nick;
    io.emit('reloadUsersList', userList);
  })
  
  socket.on('userMessage', ({ nickname, chatMessage }) => {
    let date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const time = new Date().toLocaleTimeString();
    const userMessage = `${date} ${time} - ${nickname}: ${chatMessage}`;
    io.emit('message', userMessage);
  });
});

const chatController = require('./controllers/chatController');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, '/views/')));

app.use('/', chatController);

http.listen(process.env.PORT, () => console.log('Server open...'));
