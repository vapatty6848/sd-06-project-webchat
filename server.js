const app = require('express')();
const dayjs = require('dayjs');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const randomUserNickname = require('./utils/randomUserNickname');

let msgsArray = [];

io.on('connection', (socket) => {
  console.log(`Novo usuário! ${socket.id}`);
  const nickname = randomUserNickname();

  socket.emit('userLogin', nickname);

  socket.on('message', (data) => {
    console.log(data);

    msgsArray = [...msgsArray, data.chatMessage];
    const date = dayjs().format('DD-MM-YYYY hh:mm:ss A');

    const message = `<li data-testid='message'>
      <strong>${date} - ${data.nickname}</strong>: ${data.chatMessage}
    </li>`;

    io.emit('message', message);
  });
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

httpServer.listen('3000');
