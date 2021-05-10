const moment = require('moment');
const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const port = process.env.PORT || 3000;
const cors = require('cors');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const { saveMsg, getAll } = require('./models/Messages');

app.use(cors());
function userDate() {
  const timeFormated = moment().format('DD-MM-yyyy h:mm:ss A');
  return timeFormated;
}
let randonUserLast = `user_${Math.random().toString().substr(2, 11)}`;
let users = [];
function newUserNickname({ newNickname, socket }) {
  const index = users.findIndex((user) => user.socketId === socket.id);
  users.splice(index, 1, { nickname: newNickname, socketId: socket.id });
  io.emit('updateUsers', users);
}
function newUsers(nickname, socket) {
  randonUserLast = `user_${Math.random().toString().substr(2, 11)}`;
  const newUser = { socketId: socket.id, nickname };
  return users.push(newUser);
}
io.on('connection', (socket) => {
  socket.on('conectado', (nickname) => {
    newUsers(nickname, socket);
    io.emit('updateUsers', users);
  });
  socket.on('message', async ({ chatMessage, nickname }) => {
    const times = userDate();
    io.emit('message', `${times} -  ${nickname}: ${chatMessage}`);
    saveMsg({ nickname, chatMessage, times });
  });
  socket.on('updateNickname', (newNickname) => {
    newUserNickname({ newNickname, socket });
  }); 
  socket.on('disconnect', () => {
    const usersOn = users.filter((us) => us.socketId !== socket.id);
    users = usersOn;
    io.emit('updateUsers', users); 
  });
});
app.set('view engine', 'ejs');
app.set('views', './views'); 
app.get('/', async (_req, res) => {
  const listAll = await getAll();
  const randonUser = randonUserLast;
  res.render('home', { listAll, users, randonUser });
});
httpServer.listen(port, () => console.log(`${port}`));