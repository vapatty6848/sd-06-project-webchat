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

app.use(cors());

io.on('connection', async (socket) => {
  const messages = await getMsgs();
  socket.emit('allMessages', messages);

  socket.on('message', (msg) => {
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
    io.emit('message', formattedMsg); // emite para todos
    // socket.emit - apenas quem mandou recebe
    // socket.broadcast - todos recebem, menos quem mandou
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('home');
});

http.listen('3000');