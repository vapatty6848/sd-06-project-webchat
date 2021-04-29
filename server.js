const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
// const { Http2ServerRequest } = require('http2');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    const { nickname, chatMessage } = msg;
    
    const date = new Date().toLocaleString();
    let time = date.substring(13, 11);
    
    if (parseInt(time) > 12) {
      time = 'PM';
    } else {
      time = 'AM';
    }
      
    const userMessage = `${date} ${time} - ${nickname}: ${chatMessage}`;
    const formattedMsg = userMessage.replace(/\//g, '-');
    console.log(formattedMsg);
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