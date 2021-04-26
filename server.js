require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const routerMessage = require('./controllers/MessagesController');
const { createMessages } = require('./models/MessagesModel');
const {
  createUser,
  updateUser,
  getAllUsers,
  removeUser,
} = require('./models/UsersModel');

const port = 3000;
const time = () => {
  const dNow = new Date();
  const month = () => {
    if (dNow.getMonth() + 1 < 10) {
      return `0${dNow.getMonth() + 1}`;
    }
    return dNow.getMonth() + 1;
  };
  const min = () => {
    if (dNow.getMinutes() < 10) {
      return `0${dNow.getMinutes()}`;
    }
    return dNow.getMinutes();
  };
  const dia = dNow.getDate();
  const ano = dNow.getFullYear();
  const hr = dNow.getHours();
  const localdate = `${dia}-${month()}-${ano} ${hr}:${min()}`;
  return localdate;
};
const myTime = time();
io.on('connection', async (socket) => {
  socket.on('message', async ({ nickname, chatMessage }) => {
    await createMessages(nickname, chatMessage, myTime);
    io.emit('message', `${myTime} ${nickname} ${chatMessage}`);
  });
  socket.on('initialNickname', async ({ nickname, socketID }) => {
    await createUser(nickname, socketID);
    const allUsersBack = await getAllUsers();
    io.emit('teste', allUsersBack);
  });
  socket.on('updateNick', async ({ nickname, socketIdFront }) => {
    await updateUser(nickname, socketIdFront);
  });
  socket.on('disconnect', async () => {
    await removeUser(socket.id);
    const allUsersBack = await getAllUsers();
    // console.log(socket.id, 'socket.id', 'socketid');
    io.emit('teste', allUsersBack);
  });
});
app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/', async (_req, res) => {
  const nickname = `${Math.random().toString().substr(2, 16)}`;
  const allUsersBack = await getAllUsers();
  res.render('home', { allUsersBack, nickname });
});
app.use(cors());
app.use(bodyParser.json());
app.use('/chat', routerMessage);
httpServer.listen(port, () =>
  console.log(`Example app listening on port ${port}!`));
