// Faça seu código aqui
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

// const socketOnUser = async (socket) => {
//   await socket.on('user', async (nickname) => { 
//     await Users.createUser(socket.id, nickname);
//     const users = await Users.getAllUsers();
//     await Messages.getAllMessages();
//     io.emit('users', users);
//   });
// };

// const socketOnUserUpdate = async (socket) => {
//   await socket.on('userUpdate', async (user) => {
//     await Users.updateUser(user);
//     const users = await Users.getAllUsers();
//     io.emit('users', users); 
//   });
// };

// const socketOnMessage = async (socket) => {
//   await socket.on('message', async ({ chatMessage, nickname }) => {
//     await Messages.createMessage(nickname, chatMessage, timeFormated);
//     io.emit('message', `${timeFormated} ${nickname} ${chatMessage}`);
//   });
// };

// const socketOnDisconnect = async (socket) => {
//   await socket.on('disconnect', async () => {
//     await Users.removeUser(socket.id);
//     console.log(`${socket.id} disconnected!`);
//     const users = await Users.getAllUsers();
//     io.emit('users', users);
//   });
// };

// eslint-disable-next-line max-lines-per-function
io.on('connection',  (socket) => {
  console.log(`${socket.id} conected!`);
  
   socket.on('user', async (nickname) => { 
    await Users.createUser(socket.id, nickname);
    const users = await Users.getAllUsers();
    await Messages.getAllMessages();
    io.emit('users', users);
  });

   socket.on('userUpdate', async (user) => {
    await Users.updateUser(user);
    const users = await Users.getAllUsers();
    io.emit('users', users);
  });

   socket.on('message', async ({ chatMessage, nickname }) => {
    await Messages.createMessage(nickname, chatMessage, timeFormated);
    io.emit('message', `${timeFormated} ${nickname} ${chatMessage}`);
  });
   socket.on('disconnect', async () => {
    await Users.removeUser(socket.id);
    console.log(`${socket.id} disconnected!`);
    const users = await Users.getAllUsers();
    io.emit('users', users);
  });
});

http.listen(PORT, () => {
  console.log(`Running at ${PORT}`);
});