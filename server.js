const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const utils = require('./utils');
const chatRouter = require('./routes/chat.routes');
const { users, chat } = require('./controllers');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(chatRouter);
app.use(errorHandler);

io.on('connection', (socket) => {
  socket.on('userLogin', async ({ user }) => {
    await users.createOrUpdate(user, socket.id);
    const onlineList = await users.getAll();
    io.emit('usersOnline', onlineList);
    console.log('usuário logado.');
  });

  socket.on('clientMessage', async (msg) => {
    const timestamp = `${utils.setTimestamp()}`;
    const message = { timestamp, nickname: msg.nickname, message: msg.chatMessage };
    await chat.create(message);
    io.emit('message', message);
  });

  socket.on('disconnect', async () => {
    await users.remove(socket.id);
    const onlineList = await users.getAll();
    io.emit('usersOnline', onlineList);
    console.log('Usuário saiu do chat.');
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
