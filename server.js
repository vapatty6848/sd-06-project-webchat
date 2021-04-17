const app = require('express')();
const http = require('http').createServer(app);
const dateFormat = require('dateformat');
// const path = require('path');

const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const model = require('./models/message');
const controller = require('./controller/controller');
// const Users = require('./models/users');
// const Messages = require('./models/message');

app.use(cors());
app.use('/', controller);
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index');
});

// app.get('/', async (_req, res) => {
//   const htmlPath = path.join(__dirname, '/views/index.ejs');
//   const users = await Users.getAllUsers();
//   const messages = await Messages.getAllMessages();
//   res.render(htmlPath, { users, messages });
// });

const users = [];

// const dateTime = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss TT');

// const login = async (socket, nickname, ioConnection) => {
//   await Users.create(socket.id, nickname);
//   const users = await Users.getAllUsers();
//   ioConnection.emit('usersConnected', users);
// };

// io.on('connection', (socket) => {
//   socket.on('userLogin', async (nickname) => {
//     await login(socket, nickname, io);
//   });
//   socket.on('updatedUser', async (user) => {
//     await Users.updateUser(user);
//     const users = await Users.getAllUsers();
//     io.emit('usersConnected', users);
//   });
//   socket.on('message', async ({ nickname, chatMessage }) => {
//     const msg = await Messages.createMessage(chatMessage, nickname, dateTime);
//     io.emit('message', `${msg.dateTime} ${msg.nickname} ${msg.message}`);
//   });
//   socket.on('disconnect', async () => {
//     await Users.removeUserById(socket.id);
//     const users = await Users.getAllUsers();
//     io.emit('usersConnected', users);
//   });
// });

// const PORT = process.env.PORT || 3000;

// http.listen(PORT, () => {
//   console.log(`Rodando na porta ${PORT}!!`);
// });

const addNewUser = (socket, nickname) => {
  const newUser = {
    id: socket.id,
    nickname,
  };
  users.push(newUser);
};

const addNickname = (nickname, socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users[index].nickname = nickname;
};

const changeNickname = (newNickname, socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users[index].nickname = newNickname;
};

const getNickname = (socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  return users[index].nickname;
};

const randomNickname = () => {
  const size = 16;
  const randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomic = '';
  for (let i = 0; i < size; i += 1) {
    randomic += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
  }
  return randomic;
};

const removeDisconnected = (socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users.splice(index, 1);
};

io.on('connection', (socket) => {
  const stringNickname = randomNickname();
  socket.emit('userConnected', { stringNickname, users }); addNewUser(socket, stringNickname);
  socket.broadcast.emit('connected', stringNickname);
  socket.on('message', async ({ chatMessage, nickname }) => {
    addNickname(nickname, socket);
    const dateTime = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss TT');
    const response = `${dateTime} ${getNickname(socket)} ${chatMessage}`;
    io.emit('message', response);
    await model.createMessage(chatMessage, getNickname(socket), dateTime);
  });
  socket.on('changeNickname', ({ newNickname }) => {
    changeNickname(newNickname, socket);
    io.emit('changeNickname', users);
  });
  socket.on('disconnect', () => {
    removeDisconnected(socket);
    socket.broadcast.emit('desconectar', users);
  });
});

http.listen(3000, () => console.log('Na porta 3000'));
