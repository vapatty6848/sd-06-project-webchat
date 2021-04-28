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
const { addMessages } = require('./models/messages');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', async (_req, res) => {
  res.render('../views/');
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected.`);
  socket.on('disconnect', () => console.log(`User ${socket.id} disconnected.`));

  socket.on('message', async ({ chatMessage, nickname }) => {
    const messageTime = moment().format('DD-MM-yyyy HH:mm:ss a'); // DD-MM-yyyy HH:mm:ss
    console.log(messageTime);
    await addMessages({ chatMessage, nickname, messageTime });
    const result = `${messageTime} - ${nickname} - ${chatMessage}`;
    io.emit('message', result);
  });
});

HTTP.listen(3000, () => {
  console.log('O pai ta ON na 3000');
});