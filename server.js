// Faça seu código aqui
const express = require('express');
const cors = require('cors');

const app = express();

const httpServer = require('http').createServer(app);

app.use(cors());

const io = require('socket.io')(httpServer);

const generateDate = require('./util/timestamp');

app.set('view engine', 'ejs');

const { createMessage, getAllMessages } = require('./models/Messages');

app.get('/', async (_req, res) => {
  const arrayMessages = await getAllMessages();
  res.render('home', { arrayMessages });
});

const users = [];

io.on('connection', (socket) => {
  socket.on('newUser', (nickname) => {
    users.push({ socketId: socket.id, nickname });
    io.emit('updateUsers', users);
  });

  socket.on('changeNickname', (nickname) => {
    const index = users.findIndex((element) => element.socketId === socket.id);
    users[index].nickname = nickname;
    io.emit('updateUsers', users);
  });

  socket.on('message', async ({ chatMessage: message, nickname }) => {
    // const index = users.findIndex((element) => element.socketId === socket.id);
    io.emit('message', `${generateDate()} ${nickname} ${message}`); // emite para tds os clients
    // socket.emit('canal', 'data'); // envia apenas para o msm client
    // socket.broadcast('canal', 'data'); // envia para todos menos para quem emitiu
    await createMessage(message, nickname, generateDate());
  });

  socket.on('disconnect', () => { // disconnect canal padrao do socket.io
    // io.emit('message', `${generateDate()} ${nickname} se desconectou!`);
    const userIndex = users.findIndex((u) => u.socketId === socket.id);
    users.splice(userIndex, 1);
    io.emit('updateUsers', users);
  });
});

httpServer.listen(3000, () => console.log('Express rodando na porta 3k'));
