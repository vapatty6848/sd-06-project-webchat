const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const {
  handleNewConnection,
  sendChatMessage,
  handleClientDisconnection,
} = require('./utils');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', './views');

const LOCALHOST_PORT = 3000;
const PORT = process.env.PORT || LOCALHOST_PORT;

app.get('/', (request, response) => response.status(200).render('chat'));

const users = [];

io.on('connection', (socket) => {
  // Client connection
  handleNewConnection({ socket, users, io });

  // Get message sent from client
  socket.on('message', ({ chatMessage, nickname }) => {
    sendChatMessage({ chatMessage, nickname, io });
  });

  // Client disconects
  socket.on('disconnect', () => {
    handleClientDisconnection({ socket, users, io });
  });
});

httpServer.listen(PORT, () => { console.log(`Ouvindo a porta ${PORT}`); });
