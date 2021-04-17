// Faça seu código aqui
const express = require('express');
const cors = require('cors');
const generateDate = require('./util/timestamp');

const app = express();

const httpServer = require('http').createServer(app);
app.use(cors());

const io = require('socket.io')(httpServer);
app.set('view engine', 'ejs');

const { createMessage, getAllMessages } = require('./models/Messages');

app.get('/', async (_req, res) => {
  const arrayMessages =  await getAllMessages();
  res.render('home', { arrayMessages });
});

const users = [];

io.on('connection', (socket) => {
  // io.emit('message', `${generateDate()} ${nickname} se conectou!`);
  
  socket.on('newUser', (nickname) => {
    users.push({socketId: socket.id, nickname});
    io.emit('updateUsers', users);
  });

  socket.on('changeNickname', (nickname) => {
    const index = users.findIndex((element) => element.socketId === socket.id);
    users[index].nickname = nickname;
    io.emit('updateUsers', users);
  });

  socket.on('message', async (message) => {
    const index = users.findIndex((element) => element.socketId === socket.id);
    io.emit('message', `${generateDate()} ${users[index].nickname} ${message.chatMessage}`); // emite para tds os clients
    // socket.emit('canal', 'data'); // envia apenas para o msm client
    // socket.broadcast('canal', 'data'); // envia para todos menos para quem emitiu
    await createMessage(message.chatMessage, users[index].nickname, generateDate());
  });

  socket.on('disconnect', () => { // disconnect canal padrao do socket.io
    // io.emit('message', `${generateDate()} ${nickname} se desconectou!`);

    const userIndex = users.findIndex(u => u.socketId === socket.id);
    users.splice(userIndex, 1);
    io.emit('updateUsers', users);
  });
});

httpServer.listen(3000, () => console.log('Express rodando na porta 3k'));
