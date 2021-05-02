const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = 3000;

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.set('view engine', 'views');
app.set('view', path.join(__dirname, 'views'));
app.use(express.statis(`${__dirname}/views/`));

const allUsers = [];

const addNewUser = ({ socket, nickname }) => {
  allUsers.push({ id: socket.id, nickname });
  io.emit('updatOnlineUsers', allUsers);
};

io.on('connection', async (socket) => {
  socket.on('newUser', ({ nickname }) => addNewUser({ socket, nickname }));
});

httpServer.listen(PORT, () => {
  console.log(`Servindo na porta ${PORT}`);
});
