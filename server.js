const express = require('express');
const cors = require('cors');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

app.use(cors());
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;
const users = [];

const {
  createMessage,
  getAll,
} = require('./models/messages');

app.get('/', async (_req, res) => {
  const message = await getAll();
  res.render('home', { message });
});

const createNewDate = () => {
  const date = new Date();
  const days = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const hours = date.toTimeString()
    .replace(' GMT-0300 (Brasilia Standard Time)', '');
  return `${days} ${hours}`;
};

io.on('connection', async (socket) => {
  socket.on('newUser', async (nickname) => {
    users.push({ id: socket.id, nickname });
    io.emit('updateUsers', users);
  });

  socket.on('message', async ({ chatMessage: message, nickname }) => {
    io.emit('message', `${createNewDate()} ${nickname} ${message}`);
    await createMessage(createNewDate(), nickname, message);
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
});

httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));
