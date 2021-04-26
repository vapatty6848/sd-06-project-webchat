// Package imports
const app = require('express')();

// Setting up express server and socketIO
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

// Local imports
const { MessagesController } = require('./controllers/MessagesController');
const randomUserNickname = require('./utils/randomUserNickname');
const { userJoin, changeUserNickname, getAllUsers, userDisconnect } = require('./utils/users');
const messageHandler = require('./sockets');

// Runs when user connects
io.on('connection', async (socket) => {
  const nickname = randomUserNickname();

  // Joins user to users array and emits random user nickname
  socket.emit('userLogin', userJoin(socket.id, nickname));

  io.emit('loggedUsers', getAllUsers());

  // Changes user nickname in users array
  socket.on('changeNick', (nick) => {
    changeUserNickname(socket.id, nick);
    io.emit('loggedUsers', getAllUsers());
  });

  // Message handler
  messageHandler(io, socket);

  // Removes user from users array and re-emits the array on user disconnection
  socket.on('disconnect', () => {
    const users = userDisconnect(socket.id);

    io.emit('loggedUsers', users);
  });
});

app.set('view engine', 'ejs');

app.use(MessagesController);

httpServer.listen('3000');
