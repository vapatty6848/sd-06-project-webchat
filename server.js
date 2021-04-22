const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', (req, res) => {
  res.status(200).render('index'); 
});

let users = [];

const setNewOnlineUser = (socket, newUser) => {
  socket.emit('setOnlineUsers', [{ id: socket.id, nickname: newUser }, ...users]);
  users.push({ id: socket.id, nickname: newUser });
  socket.broadcast.emit('userConnected', { nickname: newUser, users });
};

const setMessage = (chatMessage, nickname) => {
  const msgTime = new Date().toLocaleString().replace(/\//g, '-');
  const newMessage = `${msgTime} - ${nickname}: ${chatMessage}`;
  io.emit('message', newMessage);
};

const setNickname = (socket, nickname) => {
  const userToUpdate = users.find((user) => user.id === socket.id);
  users = users.filter((user) => user !== userToUpdate);
  socket.emit('updateUserNick', [{ id: socket.id, nickname }, ...users]);
  users.push({ id: socket.id, nickname });
  socket.broadcast.emit('updateUserNickToOthers', users);
};

const logOff = (socket) => {
  const userOff = users.find((user) => user.id === socket.id);
  if (userOff) {
    users = users.filter((user) => user !== userOff);
    socket.broadcast.emit('userDisconnected', { nickname: userOff.nickname, users });
  }
};

io.on('connection', (socket) => {
  socket.on('newUser', (newUser) => setNewOnlineUser(socket, newUser));
  socket.on('message', ({ chatMessage, nickname }) => setMessage(chatMessage, nickname));
  socket.on('updateUserNick', (nickname) => setNickname(socket, nickname));
  socket.on('disconnect', () => logOff(socket));
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
