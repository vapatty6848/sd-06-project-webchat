const express = require('express');

const app = express();
const httpServer = require('http').createServer(app); // servidor
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

function userDate() {
  const time = new Date();
  const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}
  ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return timeFormated;
}
const users = [];
io.on('connection', (socket) => {
  // socket.on('newUser', () => { assim que se conectar automaticamente inicia um user
    const timeFormat = userDate();
    users.push({ timeFormat, socketId: socket.id, nickName: socket.id });
    io.emit('updateUsers', users);

  socket.on('message', (message) => {
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    users.filter((us) => us.nickName !== socket.id);
    io.emit('newUsers', `${socket.id} se desconectou`);
    io.emit('updateUsers', users);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen('3000', () => console.log('servidor 1'));
