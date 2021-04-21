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
// eslint-disable-next-line max-lines-per-function
io.on('connection', (socket) => {
  socket.on('user', (usr) => {
    socket.nickname = usr;
    // const onlyOne = usrList.unshift(usr);
    usrList.push(socket.nickname);
    socket.broadcast.emit('usersList', usrList);
    const filtered = usrList.filter((el) => el !== socket.nickname);
    socket.emit('usersList', [socket.nickname, ...filtered]);
    // io.emit('usersList', usrList);
  });

  socket.on('disconnect', () => {
    const newList = usrList.filter((el) => el !== socket.nickname);
    usrList = newList;
    io.emit('usersList', newList);
  });
  socket.on('message', async (msg) => {
    const date = new Date().toLocaleString().replace(/[\/]/g, '-');
    await createMessage({ nickname: msg.nickname, chatMessage: msg.chatMessage, timestamp: date });
    io.emit('message', `${date} - ${msg.nickname}: ${msg.chatMessage}`);
  });

  socket.on('change-nick', (nick) => {
    const idx = usrList.indexOf(socket.nickname);
    usrList[idx] = nick;
    socket.nickname = nick;
    io.emit('usersList', usrList);
  });
  });

http.listen(3000);