const app = require('express')();
const http = require('http').createServer(app);
const dateFormat = require('dateformat');

const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const Messages = require('./models/messageModel');

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

const currDate = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss'); 

io.on('connection', (socket) => {
  console.log('Conectado');

  socket.on('userLogin', async (nickname) => {
    io.emit('users', nickname);
    const allMsgs = await Messages.getAll();
    allMsgs.forEach((msg) => {
      socket.emit('message', `${msg.timestamp} ${msg.nickname}: ${msg.message}`);
    });
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const dbMsg = await Messages.create(chatMessage, nickname, currDate);
    io.emit('message', `${dbMsg.timestamp} ${dbMsg.nickname}: ${dbMsg.message}`);
  });

  socket.on('users', async (user) => {
    io.emit('users', user);
  });
});

http.listen(3000);