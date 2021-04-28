const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
  },
});
const { createMessage } = require('./src/models/Messages');
const ChatController = require('./src/controller/index');

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './src/views');

app.get('/', ChatController);

let usrList = [];

const newConnection = (socket, use) => {
  usrList.push(use);
  socket.broadcast.emit('usersList', usrList);
  const filtered = usrList.filter((el) => el !== use);
  socket.emit('usersList', [use, ...filtered]);
};

const sendMessage = async (msg) => {
  const date = new Date().toLocaleString().replace(/[/]/g, '-');
  await createMessage({ nickname: msg.nickname, chatMessage: msg.chatMessage, timestamp: date });
  io.emit('message', `${date} - ${msg.nickname}: ${msg.chatMessage}`);
};

io.on('connection', (socket) => {
  let use;
  socket.on('user', (usr) => {
    use = usr;
    newConnection(socket, use);
  });

  socket.on('disconnect', () => {
    const newList = usrList.filter((el) => el !== use);
    usrList = newList;
    io.emit('usersList', newList);
  });

  socket.on('change-nick', (nick) => {
    const idx = usrList.indexOf(use);
    usrList[idx] = nick;
    use = nick;
    io.emit('usersList', usrList);
  });
});

io.on('connection', (socket) => {
  socket.on('message', async (msg) => {
    sendMessage(msg);
  });
});

http.listen(3000);
