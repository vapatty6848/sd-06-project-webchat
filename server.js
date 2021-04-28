const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

const PORT = 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'], 
  },
});

app.use(cors());

const { addMessages, getAllMsgs } = require('./models/messages');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(`${__dirname}/views/`));

let users = [];

const addNewUser = ({ nickname, socket }) => {
  users.push({ id: socket.id, nickname });
  console.log(users);

  io.emit('updateOnlineUsers', users);
};

const changeNickname = ({ newNickname, socket }) => {
  users.map((user) => {
    if (user.id === socket.id) Object.assign(user, { id: user.id, nickname: newNickname });

    return user;
  });

  io.emit('updateOnlineUsers', users);
};

const getTime = () => {
  const time = new Date();
  const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
    .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return timeFormated;
};

const handleChatMessage = async ({ nickname, chatMessage }) => {
  const timestamp = getTime();
  const result = `${timestamp} ${nickname} ${chatMessage}`;
  await addMessages({ nickname, chatMessage, timestamp });
  io.emit('message', result);
};

io.on('connection', async (socket) => {
  socket.on('newUser', ({ nickname }) => addNewUser({ nickname, socket }));

  socket.on('message', async ({ nickname, chatMessage }) =>
    handleChatMessage({ nickname, chatMessage }));

    socket.on('changeNickname', (newNickname) => changeNickname({ newNickname, socket }));

  socket.on('disconnect', () => {
    const onlineUsers = users.filter((user) => user.id !== socket.id);
    users = onlineUsers;
    io.emit('updateOnlineUsers', users);
  });
});

app.get('/', async (_req, res) => {
  const msgs = await getAllMsgs();
  const renderMsgs = msgs.map((message) => 
    `${message.timestamp} ${message.nickname} ${message.chatMessage}`);
  return res.render('index', { renderMsgs });
});

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
