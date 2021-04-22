const path = require('path');
const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: process.env.BASE_URL || 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const PORT = 3000;

const Users = require('./models/Users');
const Messages = require('./models/Messages');
const controller = require('./controllers/Messages');

app.use(cors());
app.use('/', controller);

app.get('/', (_req, res) => {
  const pathname = path.join(__dirname, 'views', '/index.html');
  res.sendFile(pathname);
});

const time = new Date();
const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
  .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

const usersOnline = [];
  
const socketOnUser = async (socket) => {
  socket.on('user', async (nickname) => { 
    await Users.createUser(socket.id, nickname);
    usersOnline.push({ id: socket.id, nickname });
    io.emit('users', usersOnline);
  });
};

const socketOnUserUpdate = async (socket) => {
  socket.on('userUpdate', async (user) => {
    Users.updateUser(user);
    usersOnline.map((newUser) => {
      const element = newUser;
      if (newUser.id === socket.id) element.nickname = user.nickname;
      return newUser;
    });
    io.emit('users', usersOnline);
  });
};

const socketOnMessage = async (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    await Messages.createMessage(nickname, chatMessage, timeFormated);
    io.emit('message', `${timeFormated} ${nickname} ${chatMessage}`);
  });
};

const socketOnDisconnect = async (socket) => {
  socket.on('disconnect', async () => {
    const index = usersOnline.findIndex((user) => user.id === socket.id);
    usersOnline.splice(index, 1);
    await Users.removeUser(socket.id);
    console.log(`${socket.id} disconnected!`);
    io.emit('users', usersOnline);
  });
};
  
  io.on('connection', (socket) => {
    console.log(`${socket.id} conected!`);
    socketOnUser(socket);
    socketOnUserUpdate(socket);
    socketOnMessage(socket);
    socketOnDisconnect(socket);
});

http.listen(PORT, () => console.log(`Running at ${PORT}`));