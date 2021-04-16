const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const { createTimestamp } = require('./utils/createTimestamp');

const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

let users = [];

io.on('connection', (socket) => {
  const newUser = { id: socket.id, nickname: `user_${Math.random().toString().substr(2, 11)}` };
  users.push(newUser);
  io.emit('updateOnlineUsers', users);

  socket.on('message', ({ nickname, chatMessage }) => {
    io.emit('message', `${createTimestamp()} - ${nickname} disse: ${chatMessage}`);
  });

  socket.on('changeNickname', (newNickname) => {
    users.map((user) => {
      if (user.id === socket.id) Object.assign(user, { id: user.id, nickname: newNickname });

      return user;
    });
    io.emit('updateOnlineUsers', users);
  });

  socket.on('disconnect', () => {
    const onlineUsers = users.filter((user) => user.id !== socket.id);
    users = onlineUsers;
    io.emit('updateOnlineUsers', users);
  });
});

app.get('/', (_req, res) => res.render('home'));

httpServer.listen(port, () => console.log(`Webchat server on port ${port}!`));