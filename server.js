const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = 3000;

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(`${__dirname}/views/`));

app.get('/', (_req, res) => {
  res.render('home');
});

let allUsers = [];

const addNewUser = ({ socket, nickname }) => {
  allUsers.push({ id: socket.id, nickname });
  console.log(allUsers);

  // io.emit('updatOnlineUsers', allUsers);
  // enviar para front de todos
};

const changeNickname = ({ newNickname, socket }) => {
  allUsers.map((user) => {
    if (user.id === socket.id) Object.assign(user, { id: user.id, nickname: newNickname });

    return user;
  });

  // io.emit('updateOnlineUsers', allUsers);
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
  // await addMessages({ nickname, chatMessage, timestamp });
  io.emit('message', result);
};

io.on('connection', async (socket) => {
  socket.on('newUser', ({ nickname }) => addNewUser({ nickname, socket }));

  io.emit('updateUsers', allUsers);
  
  socket.on('message', async ({ nickname, chatMessage }) =>
    handleChatMessage({ nickname, chatMessage }));

  socket.on('changeNickname', (newNickname) => changeNickname({ newNickname, socket }));

  socket.on('disconnect', () => {
    const onlineUsers = allUsers.filter((user) => user.id !== socket.id);
    allUsers = onlineUsers;
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servindo na porta ${PORT}`);
});
