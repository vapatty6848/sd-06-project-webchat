const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.set('view engine', 'ejs');

app.set('views', './views');

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).render('index'); 
});

let users = [];

const setNewOnlineUser = (socket) => {
  const userLogin = (newUser) => {
    socket.emit('setOnlineUsers', [{ id: socket.id, nick: newUser }, ...users]);
    users.push({ id: socket.id, nick: newUser });
    socket.broadcast.emit('userConnected', { nick: newUser, users });
  };

  socket.on('newUser', userLogin);
};

const setMessage = (socket) => {
  const sendMessage = ({ chatMessage }) => {
    const msgTime = new Date().toLocaleString().replace(/\//g, '-');
    const messageUser = users.find((user) => user.id === socket.id);
    if (messageUser) {
      const nickname = messageUser.nick;
      const newMessage = `${msgTime} - ${nickname}: ${chatMessage}`;
      io.emit('message', newMessage);
    }
  };

  socket.on('message', sendMessage);
};

const setNickname = (socket) => {
  const updateNick = (nick) => {
    const userToUpdate = users.find((user) => user.id === socket.id);
    users = users.filter((user) => user !== userToUpdate);
    socket.emit('updateUserNick', [{ id: socket.id, nick }, ...users]);
    users.push({ id: socket.id, nick });
    socket.broadcast.emit('updateUserNickToOthers', users);
  };

  socket.on('updateUserNick', updateNick);
};

const logOff = (socket) => {
  const disconnectUser = () => {
    const userOff = users.find((user) => user.id === socket.id);
    if (userOff) {
      users = users.filter((user) => user !== userOff);
      socket.broadcast.emit('userDisconnected', { nick: userOff.nick, users });
    }
  };

  socket.on('disconnect', disconnectUser);
};

io.on('connection', (socket) => {
  setNewOnlineUser(socket);
  setMessage(socket);
  setNickname(socket);
  logOff(socket);
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
