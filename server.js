const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
// const webchatController = require('./controllers/webchatController');
const model = require('./models/webchat');

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {
  const messages = await model.getAll();
  res.render('page', { messages });
  // res.sendFile(__dirname + '/');
});
// app.use('/', webchatController);

const users = [];

const formatedTimestamp = () => {
  const date = new Date();
  const formatedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  const hour = date.getHours() % 12;
  const formatedTime = `${hour}:${date.getMinutes()}:${date.getSeconds()} ${ampm}`;
  return `${formatedDate} ${formatedTime}`;
};

io.on('connection', (socket) => {
  socket.on('newUser', (user) => {
    users.push({ socketid: socket.id, nickname: user });
    io.emit('usersList', users);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    await model.postMessages(chatMessage, nickname, formatedTimestamp());
    io.emit('message', `${formatedTimestamp()} - ${nickname}: ${chatMessage}`);
  });

  socket.on('changeNick', (user) => {
    const index = users.findIndex((prev) => prev.socketid === user.socketid);
    if (index !== -1) users[index] = user;
    io.emit('usersList', users);
  });

  socket.on('disconnect', () => {
    const index = users.findIndex((user) => user.socketid === socket.id);
    if (index !== -1) users.splice(index, 1);
    io.emit('usersList', users);
  });
});

http.listen(3000);
