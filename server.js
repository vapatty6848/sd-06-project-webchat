const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }),
);

const { addMessages, getAllMsgs } = require('./models/messages');

app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const allUsers = {};

io.on('connection', (socket) => {
  const userId = socket.id;
  console.log(`User ${userId} connected.`);

  const allMsgs = getAllMsgs();
  const saveMessages = [];

  allMsgs.map((msg) => {
    const { chatMessage, nickname, date } = msg;
    return saveMessages.push(`${date} - ${nickname} - ${chatMessage}`);
  });
  io.emit('history', saveMessages);

  socket.on('message', async ({ nickname, chatMessage }) => {
    const date = new Date();
    await addMessages(nickname, chatMessage, date);
    const newMessage = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMessage);
  });

  socket.on('changeName', async ({ nickname }) => {
    io.emit('changeName', nickname);
  });

  socket.on('changeName', async ({ nickname }) => {
    allUsers.push(nickname);
    io.emit('online', allUsers);
  });

  socket.on('disconnect', () => {
    delete allUsers[socket.id];
    io.emit('online', allUsers);
  });
});

app.get('/', async (_req, res) => {
  const messages = await getAllMsgs();
  res.status(200).render('index', { messages });
});

app.get('/chat', async (_req, res) => {
  const messages = await getAllMsgs();
  res.status(200).json(messages);
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
