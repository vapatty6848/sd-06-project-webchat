// Faça seu código aqui
const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.set('view engine', 'ejs');

app.use('/', express.static(__dirname));

const users = [];

io.on('connection', (socket) => {
  const now = new Date();
  const date = `${now.getDate()}-${(now.getMonth() + 1)}-${now.getFullYear()}`;
  const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  console.log(`${socket.id} logged in at ${date} ${time}`);
  users.push(socket.id);
  socket.on('disconnect', () => {
    console.log('Someone logged off');
    users.splice(users.indexOf(socket.id), 1);
  });
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${date} ${time} - ${nickname}: ${chatMessage} }`);
  });
});

app.get('/', (req, res) => {
  res.render('home/index');
});

httpServer.listen(3000, () => console.log('Lister in port 3000'));
