const app = require('express')();
const dayjs = require('dayjs');

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const { MessagesController, saveMessage } = require('./controllers/MessagesController');
const randomUserNickname = require('./utils/randomUserNickname');

io.on('connection', (socket) => {
  console.log(`Novo usuário! ${socket.id}`);
  const nickname = randomUserNickname();

  socket.emit('userLogin', nickname);

  socket.on('message', (data) => {
    const date = dayjs().format('DD-MM-YYYY hh:mm:ss A');

    const message = `<li data-testid='message'>
    <strong>${date} - ${data.nickname}</strong>: ${data.chatMessage}
    </li>`;

    const savingMsg = {
      ...data,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      date,
      liMsg: message,
    };

    saveMessage(savingMsg);
    io.emit('message', message);
  });
});

app.set('view engine', 'ejs');

app.use(MessagesController);

httpServer.listen('3000');
