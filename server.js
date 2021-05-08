const express = require('express');
const cors = require('cors');
const dateFormat = require('dateformat');

const PORT = 3000;
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const messagesDB = require('./models/messagesModel');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

const usersList = [];

const findUser = (listNickname, id, nickname) => {
  const detectUser = listNickname.findIndex((user) => user.id === id);
  listNickname.splice(detectUser, 1, { id, nickname });
    return listNickname;
};

const dateAndTime = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');

io.on('connection', (socket) => {
  console.log(`usuário conectado ${socket.id}`);
  socket.on('connectedUsers', ({ id, nickname }) => {
    usersList.push({ id, nickname });
    io.emit('connectedUsers', (usersList));
  });
  socket.on('changeNickname', ({ id, nickname }) => {
    const userList = findUser(usersList, id, nickname);
    console.log(userList);
    io.emit('nickname', (userList));
  });
  socket.on('message', async ({ chatMessage, nickname }) => {
    const newMessage = `${dateAndTime} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMessage);
    await messagesDB.createMessage({ message: chatMessage, nickname, timestamp: dateAndTime });
  });
  socket.on('disconnect', () => {
    console.log(`usuário desconectado ${socket.id}`);
  });
});

app.get('/', async (_req, res) => {
  const messages = await messagesDB.getAllMessages();

  return res.render('home', { messages });
});

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));