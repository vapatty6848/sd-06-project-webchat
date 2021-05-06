const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const { getMsgs, saveMsgs } = require('./models/chatModel');

const validateMsg = async (msg) => {
  const { nickname, chatMessage } = msg;
    
  const date = new Date().toLocaleString();
  let time = date.substring(13, 11);
  const saveToDB = { message: chatMessage, nickname, timestamp: date };
  saveMsgs(saveToDB);

  if (parseInt(time, 10) > 12) {
    time = 'PM';
  } else {
    time = 'AM';
  }
  
  const userMessage = `${date} ${time} - ${nickname}: ${chatMessage}`;
  const formattedMsg = userMessage.replace(/\//g, '-');
  io.emit('message', formattedMsg);
};

app.use(cors());
let onlineUsers = [];

io.on('connection', async (socket) => {
  const messages = await getMsgs();
  socket.emit('allMessages', messages);

  socket.on('getName', (nickname) => {
    console.log(nickname);
    onlineUsers.push({ id: socket.id, nickname });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('updateName', (getName) => {
    const newName = onlineUsers.find((user) => user.id === socket.id);
    newName.nickname = getName;
    onlineUsers = onlineUsers.map((user) => (user.id === socket.id ? newName : user));
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('disconnect', () => {
    const usersLeft = onlineUsers.filter((user) => user.id !== socket.id);
    onlineUsers = usersLeft;
    io.emit('onlineUsers', usersLeft);
  });
  
  socket.on('message', async (msg) => validateMsg(msg));
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('home');
});

http.listen('3000');

// io.emit('message', formattedMsg); emite para todos
// socket.emit - apenas quem mandou recebe
// socket.broadcast - todos recebem, menos quem mandou