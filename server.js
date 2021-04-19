const express = require('express');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const app = express();
app.use(express.static(`${__dirname}/public/`));

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const { createTimestamp } = require('./utils/TimeStamp');

app.set('view engine', 'ejs');
app.set('views', './views');

let users = [];

// Socket Connection
io.on('connection', (socket) => {
  console.log(`Id do usúario conectado: ${socket.id}`);
  
  const newUser = { id: socket.id, nickname: `user_${Math.random().toString().substr(2, 11)}` };
  users.push(newUser);
  io.emit('updateOnlineUsers', users);

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${createTimestamp()} - ${nickname} disse: ${chatMessage}`);
  });

  socket.on('disconnet', () => {
    users = users.filter((user) => user.id === socket.id);
    io.emit('updateOnlineUsers', users);
  });
});

app.get('/', (_req, res) => res.render('home'));

httpServer.listen(PORT, () => console.log(`App Webchat listening on port ${PORT}!`));
