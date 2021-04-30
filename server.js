const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const cors = require('cors');
const moment = require('moment');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const Users = require('./models/users');
const Messages = require('./models/messages');

app.use(cors());

app.get('/', async (req, res) => {
  const views = path.join(__dirname, '/views/index.ejs');
  const users = await Users.getAll();
  const messages = await Messages.getAll();
  res.render(views, { users, messages });
});

const formatedDate = moment().format('DD-MM-yyyy HH:mm:ss a');

const login = async (socket, nickname, ioConnection) => {
  await Users.create(socket.id, nickname);
  const users = await Users.getAll();
  ioConnection.emit('usersConnected', users);
};

io.on('connection', (socket) => {
  socket.on('userLogin', async (nickname) => {
    await login(socket, nickname, io);
  });

  socket.on('updatedUser', async (user) => {
    await Users.update(user);
    const users = await Users.getAll();
    io.emit('usersConnected', users);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const msg = await Messages.create(chatMessage, nickname, formatedDate);
    io.emit('message', `${msg.timestamp} ${msg.nickname} ${msg.message}`);
  });

  socket.on('disconnect', async () => {
    await Users.removeById(socket.id);
    const users = await Users.getAll();
    io.emit('usersConnected', users);
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Running server on port ${PORT}`);
});