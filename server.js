require('dotenv').config();
const moment = require('moment');
const express = require('express');
const path = require('path'); 

const app = express();
const PORT = process.env.PORT || 3000;

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'views ')));
app.set('view engine', 'ejs');
app.set('views', './views');

const users = [];

io.on('connection', async (socket) => {
  console.log(`${socket.id} conectado`);
  socket.on('disconnect', () => {
    console.log('Desconectado');
  });
  const date = moment().format('DD-MM-yyyy HH:mm:ss');
  console.log(date);
 
  socket.on('message', (message) => {
    io.emit('message', `${date} ${message.nickname} Diz: ${message.chatMessage}`);
  });
  socket.on('user', () => {
    const nickname = socket.id.slice(0, 16);
    const user = { nickname, id: socket.id };
    users.push(user);
    io.emit('nickUser', users);
  });
  io.emit('user', `${socket.id} acabou de entrar`);
});

app.get('/', (_req, res) => res.render('chat.ejs'));
http.listen(PORT, () => console.log(`webchat port: ${PORT}!`));