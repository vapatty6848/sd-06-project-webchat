require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const MessagesController = require('./controllers/MessagesController');
const { formatMessage } = require('./utils/formatting');

const messagesController = new MessagesController();

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

const PORT = process.env.PORT || 3000;
const users = [];

app.get('/', async (_req, res) => {
  const messagesArray = await messagesController.list();
  const messagesFormated = messagesArray.map((message) => formatMessage(message));
  res.render('home', { messages: messagesFormated });
});

io.on('connection', (socket) => {
  socket.on('newUser', (nickname) => {
    users.push({ id: socket.id, nickname });
    io.emit('updateUsers', users);
  });
  socket.on('newNickname', (nickname) => {
    const userIndex = users.findIndex((user) => user.id.includes(socket.id));
    users[userIndex].nickname = nickname;
    io.emit('updateUsers', users);
  });
  socket.on('message', async ({ nickname, chatMessage }) => {
    const messageSent = await messagesController.create({ nickname, chatMessage });
    io.emit('message', formatMessage(messageSent));
  });
  socket.on('disconnect', () => {
    const userIndex = users.findIndex((user) => user.id === socket.id);
    users.splice(userIndex, 1);
    io.emit('updateUsers', users);
  });
});

httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));
