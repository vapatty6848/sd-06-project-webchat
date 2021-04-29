const express = require('express');

const app = express();
const HTTP = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');
const io = require('socket.io')(HTTP, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { newMessages, allMessages } = require('./models/messages');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (_req, res) => {
  const messageObject = await allMessages();
  const messageList = messageObject.map((msg) => `${msg.date} ${msg.nickname} ${msg.chatMessage}`);
  res.render('../views/', { messageList });
  console.log(messageObject);
});

io.on('connection', (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const messageDate = moment().format('DD-MM-yyyy HH:mm:ss a'); // DD-MM-yyyy HH:mm:ss
    await newMessages({ nickname, chatMessage, date: messageDate });
    const result = `${messageDate} - ${nickname} - ${chatMessage}`;
    io.emit('message', result);
  });
});

HTTP.listen(3000, () => {
  console.log('O pai ta ON na 3000');
});