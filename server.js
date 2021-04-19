const express = require('express');

const app = express();
const httpServer = require('http').createServer(app); // servidor

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
  const time = new Date();
  const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}
  ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return timeFormated;
}
let users = [];

function newUserFunc(randonUser, socket) {
  const newUser = { socketId: socket.id, nickname: randonUser };
  users.push(newUser);
  io.emit('updateUsers', users);
  socket.on('message', async ({ nickname, chatMessage }) => {
    const times = userDate();
    await saveMsg({ nickname, chatMessage, times });
    const message = `${times} ${nickname} ${chatMessage}`;
    io.emit('message', message);
  });
}

io.on('connection', (socket) => {
  socket.on('connectUser', ({ randonUser }) => {
    newUserFunc(randonUser, socket);
  });

  socket.on('updateNickname', (newNickname) => {
    const userNick = users.map((user) => { 
      if (user.socketId === socket.id) {
        return { ...user, nickname: newNickname };
      }
      return user;      
     }); 
      users = userNick;
      io.emit('updateUsers', users);     
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
  res.render('home', { listAll });
}); 

httpServer.listen('3000', () => console.log('servidor 1'));
