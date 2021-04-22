const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const dateFormat = require('dateformat');
const model = require('./models/message');
const formatMessage = require('./utils/formatMessage');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

const PORT = process.env.PORT || 3000;

let users = [];

app.get('/', async (_req, res) => {
  const previousMessages = await model.getAllMessages();
  const oldMessages = previousMessages.map((message) => formatMessage(message));
  return res.render('index', { oldMessages });
});

const userConnect = ({ nickname, socket }) => {
  users.push({ id: socket.id, nickname });
  io.emit('updateUsers', users);
};

const messageEvent = async ({ nickname, chatMessage }) => {
  const timestamp = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
  const message = formatMessage({ nickname, chatMessage, timestamp });
  await model.saveMessage({ nickname, chatMessage, timestamp });
  io.emit('message', message);
};

const changeNick = ({ newNickname, socket }) => {
  users.map((user) => {
    if (user.id === socket.id) Object.assign(user, { id: user.id, nickname: newNickname });
    return user;
  });
  io.emit('updateUsers', users);
};

const userDisconnected = (socket) => {
  const userList = users.filter((user) => user.id !== socket.id);
  users = userList;
  io.emit('updateUsers', users);
};

io.on('connection', async (socket) => {  
  socket.on('userConnected', ({ nickname }) => userConnect({ nickname, socket }));
  socket.on('changeNickname', (newNickname) => changeNick({ newNickname, socket }));
  socket.on('message', ({ nickname, chatMessage }) => messageEvent({ nickname, chatMessage }));
  socket.on('disconnect', () => userDisconnected(socket));
});

httpServer.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}.`));