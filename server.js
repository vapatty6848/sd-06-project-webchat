const app = require('express')();
const http = require('http').createServer(app);
const dateFormat = require('dateformat');

const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

const currDate = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss'); 

io.on('connection', (socket) => {
  console.log('Conectado');

  socket.on('userLogin', (nickname) => {
    io.emit('users', nickname);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${currDate} ${nickname}: ${chatMessage}`);
  });

  socket.on('users', (user) => {
    console.log(user);
    io.emit('users', user);
  });
});

http.listen(3000);