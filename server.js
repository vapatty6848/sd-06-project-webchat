const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const cors = require('cors');
const dateFormat = require('dateformat');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const Users = require('./models/Users');
const Messages = require('./models/Messages');

app.use(cors());

app.get('/', async (req, res) => {
  const htmlPath = path.join(__dirname, '/views/index.ejs');
  const users = await Users.getAll();
  const messages = await Messages.getAll();
  res.render(htmlPath, { users, messages });
});

const dateTimeStamp = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss'); 

io.on('connection', (socket) => {
  console.log(`User ${socket.id} conectado`);

  socket.on('userLogin', async (nickname) => {
    await Users.create(socket.id, nickname);
    const users = await Users.getAll();
    io.emit('usersConnected', users);
  });

  socket.on('updatedUser', async (user) => {
    await Users.update(user);
    const users = await Users.getAll();
    io.emit('usersConnected', users);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const msg = await Messages.create(chatMessage, nickname, dateTimeStamp);
    io.emit('message', `${msg.timestamp} ${msg.nickname} ${msg.message}`);
  });

  socket.on('disconnect', async () => {
    await Users.removeById(socket.id);
    const users = await Users.getAll();
    io.emit('usersConnected', users);
    console.log(`User ${socket.id} desconectado`);
  });
});

// socket.on('updatedUsers', async (user) => {
//   const { nickname, id } = user;
//   socket.emit('usersConnected', { user, users });
// });

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Running server on port ${PORT}`);
});
