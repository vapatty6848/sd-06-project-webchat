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
// const { users, chat, clearDB } = require('./controllers');
const { users, chat } = require('./controllers');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(chatRouter);
app.use(errorHandler);

// clearDB.clear();

io.on('connection', (socket) => {
  socket.on('userLogin', async ({ user }) => {
    await users.createOrUpdate(user, socket.id);
    const onlineList = await users.getAll();
    io.emit('usersOnline', onlineList);
    console.log('usuário logado.');
  });

  socket.on('message', async (msg) => {
    const { messageFrontend, messageBackend } = utils.setupMessages(msg);
    await chat.create(messageBackend);
    io.emit('message', messageFrontend);
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
