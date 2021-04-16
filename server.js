const app = require('express')();
const path = require('path'); // resolve o caminho plantão Gargani
const http = require('http').createServer(app);

const cors = require('cors');
const dateFormat = require('dateformat');// https://www.npmjs.com/package/dateformat

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const Users = require('./models/Users');
const Messages = require('./models/Messages');

app.use(cors());

app.get('/', async (_req, res) => {
  const htmlPath = path.join(__dirname, '/views/index.ejs');
  const users = await Users.getAll();
  const messages = await Messages.getAll();
  res.render(htmlPath, { users, messages });
});

const dateTimeStamp = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss'); 

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
    const msg = await Messages.create(chatMessage, nickname, dateTimeStamp);
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
  console.log(`Rodando na porta ${PORT}!!`);
});
