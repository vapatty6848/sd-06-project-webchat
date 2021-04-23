const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const {
  storeMessage,
  getAllMessages,
} = require('./models/messages');

app.use(cors());
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;
const users = [];

app.get('/', async (_req, res) => {
  const message = await getAllMessages();
  res.render('home', { message });
});

const getDate = () => {
  const newDate = new Date();
  const hour = `${newDate.getHours()}:${newDate.getMinutes()}`;
  const date = `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`;
  return `${date} ${hour}`;
};

io.on('connection', async (socket) => {
  socket.on('newUser', async (nickname) => {
    users.push({ id: socket.id, nickname });
    io.emit('updateUsers', users);
  });

  socket.on('newNick', (newNick) => {
    const index = users.findIndex((item) => item.id.includes(socket.id));
    users[index].nickname = newNick;

    io.emit('updateUsers', users);
  });

  socket.on('disconnect', () => {
    const index = users.findIndex((item) => item.id.includes(socket.id));
    users.splice(index, 1);

    io.emit('updateUsers', users);
  });

  socket.on('message', async ({ chatMessage: message, nickname }) => {
    io.emit('message', `${getDate()} ${nickname} ${message}`);
    await storeMessage(getDate(), nickname, message);
  });
});

http.listen(port, () => console.log(`Listening on port ${port}`));
