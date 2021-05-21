const express = require('express');

const cors = require('cors');
const path = require('path');
const moment = require('moment');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { 
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const { addMessages } = require('./models/messageModel');

app.use(cors());
app.use(express.urlencoded({
  extended: true }));
app.use(express.static(path.join(__dirname, 'views ')));

app.set('view engine', 'ejs');

app.set('views', './views');

io.on('connection', async (socket) => {
  socket.on('disconnect', () => {
    console.log('o Lendário desconectou!');
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const messageFormat = moment().format('DD-MM-yyyy HH:mm:ss A');
    const result = `${messageFormat} - ${nickname} : ${chatMessage}`;
    io.emit('message', result);
  });
});

app.get('/', async (_req, res) => {
  res.render('../views')
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Ouvindo a porta ${PORT}`);
});
