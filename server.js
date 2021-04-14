const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const moment = require('moment');
const io = require('socket.io')(httpServer);

app.use(express.json());

io.on('connection', (socket) => {
  console.log(`Usuário ${socket.id} conectou!`);

  socket.on('message', (obj) => {
    const date = moment().format('DD-MM-yyyy hh:mm');

    io.emit('message', {
      chatMessage: `${date} - ${obj.nickname}: ${obj.chatMessage}`,
      nickname: obj.nickname,
    });
  });
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

httpServer.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
