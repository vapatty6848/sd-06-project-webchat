const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv/config');

const { formatDate, formatMessage } = require('./utils');
const routes = require('./routes');
const { chatController } = require('./controllers');

const app = express();
const server = http.createServer(app);

const options = {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
};
const io = new Server(server, options);

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(routes);

let users = [];
const dateFormated = formatDate();

io.on('connection', (socket) => {
  socket.on('new-user-connected', (nickname) => {
    users.push({ socketId: socket.id, nickname });
    io.emit('updateUsers', users);
  });

  socket.on('update-nickname', (nickname) => {
    const userIndex = users.findIndex((user) => user.socketId.includes(socket.id));
    users[userIndex].nickname = nickname;
    io.emit('updateUsers', users);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const message = formatMessage(dateFormated, chatMessage, nickname);
    await chatController.createMessages(chatMessage, nickname, dateFormated);
    io.emit('chat-message', message);
  });

  socket.on('disconnect', () => {
    const newUsers = users.filter((user) => user.socketId !== socket.id);
    users = [...newUsers];
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
