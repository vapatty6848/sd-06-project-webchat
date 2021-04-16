const express = require('express');
const moment = require('moment');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
});

const users = [];

io.on('connection', (socket) => {
  socket.on('newUser', (user) => {
    users.push({ socketId: socket.id, name: user });
    io.emit('updateUsers', users);
  });

  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;
    const time = moment(new Date()).format('DD-MM-yyyy h:mm:ss A');
    io.emit('newMessage', `${time} - ${nickname}: ${chatMessage}`); // envia pra todos
    socket.emit('privateMessage', 'Apenas quem enviou recebe');
    socket.broadcast.emit('broadcastMessage', 'Todos recebem, menos quem enviou');
  });

  socket.on('disconnect', () => {
    const index = users.findIndex((e) => e.socketId === socket.id);
    if (index > 0) {
      users.splice(index, 1);
      io.emit('updateUsers', users);
    }
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (_req, res) => {
  res.render('chat');
});

const port = 3000;

httpServer.listen(port, () => console.log(`Socket executando na porta ${port}`));
