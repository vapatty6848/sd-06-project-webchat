const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const Helpers = require('./helpers');
const Messages = require('./models/messagesModel');
const Users = require('./models/onlineUsers');

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

const getUsers = async () => {
  Users.getAll().then((users) => {
    io.emit('server-client-users-online', users);
  });
};

io.on('connection', (socket) => {
  socket.on('client-server-get-users', () => getUsers());

  socket.on('message', async ({ chatMessage, nickname }) => {
    Messages.create(chatMessage, nickname, date);
    const formatedMessage = Helpers.formatMessage({ date, nickname, chatMessage });
    io.emit('message', formatedMessage);
  });

  socket.on('client-server-add-user', async (nickname) => Users.addUser(nickname, socket.id));

  socket.on('client-server-update-user', async (nickname) => {
    await Users.updateUser(nickname, socket.id);
    getUsers();
  });

  socket.on('disconnect', async () => {
    await Users.deleteUser(socket.id);
    getUsers();
  });
});

server.listen(port, () => {
  console.log(`Listening http://localhost:${port || 3000}`);
});
