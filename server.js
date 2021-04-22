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
const { saveMsg, getAll } = require('./models/chatMsg');

app.use(cors());

function userDate() {
  const timeFormated = moment().format('DD-MM-yyyy h:mm:ss A');
  return timeFormated;
}
let users = [];
 function newUserNickname({ newNickname, socket }) {
  const userNick = users.map((user) => { 
    if (user.socketId === socket.id) {
      return { ...user, nickname: newNickname };
    } // verifica se o nick existe e atualiza ou mantem
    return user;      
   }); 
    users = userNick;
    console.log('linha 32', users, userNick);
    io.emit('updateUsers', users);
 }

io.on('connection', (socket) => {
  const randonUser = `user_${Math.random().toString().substr(2, 11)}`;
  const newUser = { socketId: socket.id, nickname: randonUser };
  users.push(newUser);
  io.emit('updateUsers', users);
  socket.on('message', async ({ nickname, chatMessage }) => {
    const times = userDate();
    await saveMsg({ nickname, chatMessage, times });
    const message = `${times} ${nickname} ${chatMessage}`;
    io.emit('message', message);
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

app.set('view engine', 'ejs'); // cria
app.set('views', './views'); // local das paginas serem mostradas arquivos que vou quero enviar

app.get('/', async (_req, res) => {
  const listAll = await getAll();
  console.log('listAll', listAll);
  res.render('home', { listAll });
}); 

httpServer.listen(port, () => console.log(`${port}`));
