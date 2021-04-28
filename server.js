const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const moment = require('moment');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './view');

app.get('/', (_req, res) => {
  res.render('home', {}); 
});

let arrayUsers = [];

const formatMessage = ({ chatMessage, nickname }) => {
  const time = moment().format('DD-MM-YYYY HH:mm:ss A');
  const message = `${time}  ${nickname} ${chatMessage}`;
  io.emit('message', message);
};

io.on('connection', (socket) => {
  console.log(`Novo usuário conectado: ${socket.id}`);
  
  socket.on('message', (message) => formatMessage(message));

  socket.on('connectedUser', (nickname) => {
    arrayUsers.push({ id: socket.id, nickname });
    io.emit('nickname', arrayUsers);
  });

  socket.on('updatedUser', (newNickname) => {
    const chatUser = arrayUsers.find((user) => user.id === socket.id);
    chatUser.nickname = newNickname;
    arrayUsers = arrayUsers.map((user) => (user.id === socket.id ? chatUser : user));
    io.emit('nickname', arrayUsers);
  });

  socket.on('disconnect', () => {
    console.log(`Usuário ${socket.id} desconectado`);
  });
});
httpServer.listen(PORT, () => console.log(`on PORT ${PORT}`));
