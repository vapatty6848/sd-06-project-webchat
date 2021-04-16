const express = require('express');
const dayjs = require('dayjs');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

let msgsArray = [];

io.on('connection', (socket) => {
  console.log(`Novo usuário! ${socket.id}`);
  socket.on('bc-message', (data) => {
    console.log(data);

    msgsArray = [...msgsArray, data.message];
    const date = dayjs().format('DD-MM-YYYY hh:mm:ss A');

    const message = `<li>
      <strong>${date} - ${data.userNickname}</strong>: ${data.message}
    </li>`;

    io.emit('message', message);
  });
});


app.set('view engine', 'ejs');

app.get('/webchat', (req, res) => {
  res.render('home');
});

httpServer.listen('3000');
