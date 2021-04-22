const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'], 
  },
});
const { chatController } = require('./controllers/chatController');

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

const ioConnection = (socket) => chatController(io, socket);

io.on('connection', ioConnection);

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});