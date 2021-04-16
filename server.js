const express = require('express');

const app = express();
const cors = require('cors');
const crypto = require('crypto');

app.use(cors());

app.set('view engine', 'ejs'); // Informa para o app que será utilizado ejs para montar a página.

app.set('views', './views');

const PORT = 3000;

const http = require('http').createServer(app);

const dateFormat = require('dateformat');

let users = [];

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const handleNickNameChange = (newNickName, oldNickName) => {
  users = users.map((user) => {
    if (user.nickname === oldNickName) { 
      return { ...user, nickname: newNickName };
    }
    return user;
  });
  console.log(users);
};

app.get('/', async (_request, response) => {
  response.render('../views/');
});

io.on('connection', (socket) => {
  const randomNickName = crypto.randomBytes(8).toString('hex');
  users.push({ id: socket.id, nickname: randomNickName });
  users.reverse();
  socket.emit('connected', randomNickName);
  io.emit('userList', users);

  socket.on('message', async ({ nickname, chatMessage }) => {
    const dateTimeStamp = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
    const message = `${dateTimeStamp} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });

  socket.on('nickNameChange', async (newNickName, oldNickName) => {
    handleNickNameChange(newNickName, oldNickName);
    io.emit('userList', users);
  });

  socket.on('disconnect', () => {
    users = users.filter((user) => user.id !== socket.id);
    io.emit('userList', users);
  });
});

http.listen(PORT, () => {
  console.log(`Server has been started on Port ${PORT}.`);
});
