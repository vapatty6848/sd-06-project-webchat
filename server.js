const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
  },
});
const { createMessage } = require('./models/Messages');
const ChatController = require('./controller/index');

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', ChatController);

let usrList = [];

const newConnection = (socket, userT) => {
  usrList.push(userT);
  socket.broadcast.emit('usersList', usrList);
  const filtered = usrList.filter((el) => el !== userT);
  socket.emit('usersList', [userT, ...filtered]);
};

const sendMessage = async (msg) => {
  const date = new Date().toLocaleString().replace(/[/]/g, '-');
  await createMessage({ nickname: msg.nickname, chatMessage: msg.chatMessage, timestamp: date });
  io.emit('message', `${date} - ${msg.nickname}: ${msg.chatMessage}`);
};

io.on('connection', (socket) => {
  let userT;
  socket.on('user', (usr) => {
    userT = usr;
    newConnection(socket, userT);
  });

  socket.on('disconnect', () => {
    const newList = usrList.filter((el) => el !== userT);
    usrList = newList;
    io.emit('usersList', newList);
  });

  socket.on('change-nick', (nick) => {
    const idx = usrList.indexOf(userT);
    usrList[idx] = nick;
    userT = nick;
    io.emit('usersList', usrList);
  });
});

io.on('connection', (socket) => {
  socket.on('message', async (msg) => {
    sendMessage(msg);
  });
});

http.listen(3000);