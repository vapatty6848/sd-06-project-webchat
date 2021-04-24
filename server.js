const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.set('view engine', 'ejs'); // caminha para o eja renderizar uma pg.
app.set('views', './views');

app.use(express.urlencoded({ extend: true }));
app.use(express.json());

const { saveMessages, getMessages } = require('./models/message');

const messagesFormatter = ({ nickname, chatMessage, timestamp }) => {
  const formattedMessage = `${timestamp} - ${nickname} disse: ${chatMessage}`;

  return formattedMessage;
};

app.get('/', async (_req, res) => {
  const previousMessages = await getMessages();
  const messagesToRender = previousMessages.map((message) => messagesFormatter(message));
  return res.render('home', { messagesToRender });
});

// array de usuários
const users = [];
// função user aleatorio.
const getFisrtUser = (socket) => {
  const randomUser = (`${Math.random().toString(36)}00000000000000000`).slice(2, 16 + 2);
  const objUser = { name: randomUser, socketId: socket.id };
  users.push(objUser);
  //  socket.emit('withoutNick', randomUser);
  io.emit('updateUsers', users);
};
// função update user com nickName
const updateNickame = (socket) => {
  socket.on('nickName', (nickname) => {
    const userObj = { name: nickname, socketId: socket.id };
    const userId = users.findIndex((el) => el.socketId === socket.id);
    if (userId >= 0) { users.splice(userId, 1); }
    users.push(userObj);
    io.emit('updateUsers', users);
    socket.emit('yourNick', nickname);
  });
};
// função mandar msg
const sendMsgNick = async (socket) => {
  socket.on('message', async ({ nickname, chatMessage }) => {
    const data = new Date();
    const timestamp = `${data.getDate()}-${(data.getMonth() + 1)}-${data.getFullYear()} `
    + `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`;
     const fullMsg = `${timestamp} - ${nickname}: ${chatMessage}`;
     await saveMessages({ timestamp, nickname, chatMessage });
     io.emit('message', fullMsg);
  });
};
//  função desconectar user.
const disconnect = (socket) => {
  socket.on('disconnect', () => {
    const userId = users.findIndex((el) => el.socketId === socket.id);
    if (userId >= 0) { users.splice(userId, 1); }
    socket.broadcast.emit('updateUsers', users);
  });
};
io.on('connection', (socket) => {
  getFisrtUser(socket);
  updateNickame(socket);
  disconnect(socket);
  sendMsgNick(socket);
  //  sendMsg(socket);
});

httpServer.listen(PORT, () => console.log(`socket.io ouvindo na port ${PORT}`));