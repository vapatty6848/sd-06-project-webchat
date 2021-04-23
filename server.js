const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const Helpers = require('./helpers');
const Messages = require('./models/messagesModel');

require('dotenv/config');
const Routes = require('./Routes');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use('/', Routes);
app.set('view engine', 'ejs');

const server = http.createServer(app);
const io = new socketIo.Server(server);
const date = Helpers.dateGenerator();
const serverClientUsers = 'server-client-users-online';
let users = [];

// const getUsers = async () => {
//   Users.getAll().then((users) => {
//     io.emit('server-client-users-online', users);
//   });
// };

const addUser = (nickname, socketId) => {
  // users = [...users, { nickname, socketId }];
  users.push({ nickname, socketId });
  io.emit(serverClientUsers, users);
};

const updateUser = (nickname, socketId) => {
  const result = users.filter((user) => user.socketId !== socketId);
  users = [...result, { nickname, socketId }];

  io.emit(serverClientUsers, users);
};

const deleteUser = (socketId) => {
  const result = users.filter((user) => user.socketId !== socketId);
  users = [...result];
  io.emit(serverClientUsers, users);
};

io.on('connection', (socket) => {
  socket.on('client-server-get-users', () => {
    io.emit('server-client-users-online', users);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    Messages.create(chatMessage, nickname, date);
    const formatedMessage = Helpers.formatMessage({ date, nickname, chatMessage });
    io.emit('message', formatedMessage);
  });

  socket.on('client-server-add-user', async (nickname) => addUser(nickname, socket.id));

  socket.on('client-server-update-user', async (nickname) => updateUser(nickname, socket.id));

  socket.on('disconnect', async () => deleteUser(socket.id));
});

server.listen(port, () => {
  console.log(`Listening http://localhost:${port || 3000}`);
});
