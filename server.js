const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const Helpers = require('./helpers');

require('dotenv/config');
const Routes = require('./Routes');

const port = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use('/', Routes);
app.set('view engine', 'ejs');

const server = http.createServer(app);
const io = new socketIo.Server(server);

io.on('connection', (socket) => {
  console.log('Usuário Conectado:', socket.id);

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = Helpers.dateGenerator();
    const formatedMessage = Helpers.formatMessage({ date, nickname, chatMessage });

    io.emit('message', formatedMessage);
  });
});

server.listen(port, () => {
  console.log(`Listening http://localhost:${port || 3000}`);
});
