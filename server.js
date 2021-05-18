require('dotenv').config();
const moment = require('moment');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const chatController = require('./controller/messageController');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views ')));
app.set('view engine', 'ejs');
app.set('views', './views');

let users = [];
const date = moment().format('DD-MM-yyyy HH:mm:ss');

io.on('connection', async (socket) => {
  console.log(`${socket.id} conectado`);
  socket.on('disconnect', () => {
    const newListUser = users.filter((user) => user.id !== socket.id);
    users = newListUser;
    io.emit('nickUser', newListUser);
  });
  socket.on('message', async (message) => {
    const formatedMessage = chatController.formatMsg(date, message.nickname, message.chatMessage);
    await chatController.insertMessage(date, message.nickname, message.chatMessage);
    io.emit('message', formatedMessage);
  });
  socket.on('user', () => {
    const nickname = socket.id.slice(0, 16);
    const user = { nickname, id: socket.id };
    users.push(user);
    io.emit('nickUser', users);
  });
  io.emit('user', `${socket.id} acabou de entrar`);
});

app.get('/', chatController.getMessage);

app.post('/', chatController.insertMessage);

http.listen(PORT, () => console.log(`webchat port: ${PORT}!`));