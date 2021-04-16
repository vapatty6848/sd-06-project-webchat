const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
// const webchatController = require('./controllers/webchatController');
const model = require('./models/webchat');

app.use(cors());
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const messages = await model.getAll();
  res.render('page', { messages });
  // res.sendFile(__dirname + '/');
});
// app.use('/', webchatController);

const users = [];
const formatedTimestamp = () => {
  const date = new Date();
  const formatedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  const hour = date.getHours() % 12;
  const formatedTime = `${hour}:${date.getMinutes()}:${date.getSeconds()} ${ampm}`;
  return `${formatedDate} ${formatedTime}`;
};

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('newUser', (user) => {
    users.push({ socketid: socket.id, nickname: user });
    io.emit('usersList', users);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    console.log(chatMessage);
    await model.postMessages(chatMessage, nickname, formatedTimestamp());
    io.emit('message', `${formatedTimestamp()} - ${nickname}: ${chatMessage}`);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
    const index = users.findIndex((user) => user.socketid === socket.id);
    users.splice(index, 1);
    io.emit('usersList', users);
  });
});

http.listen(3000);
