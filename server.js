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

app.set('view engine', 'ejs');
app.set('views', './views');

const validateMsg = (msg) => {
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
  socket.on('getName', (nickname) => {
    console.log(onlineUsers);
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
    console.log(onlineUsers);
    io.emit('onlineUsers', usersLeft);
  });
  
  socket.on('message', (msg) => validateMsg(msg));
});

app.get('/', async (_req, res) => {
  const messages = await getMsgs();
  res.status(200).render('home', { messages });
});

http.listen('3000');

// io.emit('message', formattedMsg); emite para todos
// socket.emit - apenas quem mandou recebe
// socket.broadcast - todos recebem, menos quem mandou