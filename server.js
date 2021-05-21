const express = require('express');

const app = express();
const cors = require('cors');

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './views');

const PORT = 3000;

const http = require('http').createServer(app);


const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (_req, res) => {
  res.render('../views/');
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} has connected.`);
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} has disconnected.`);
  });
});

http.listen(PORT, () => {
  console.log(`We are Venom on ${PORT}`);
});