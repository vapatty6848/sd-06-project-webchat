const express = require('express');
const Randomstring = require('randomstring');
const loadash = require('lodash');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

const io = require('socket.io')(http, {
    cors: {
      origin: 'http://localhost:3000/',
      methods: ['GET', 'POST'],
    },
});

app.use(cors());

app.locals.fromNow = () => moment().format('DD-MM-yyyy h:mm:ss A');

app.locals.generateNickname = () => Randomstring.generate({ length: 16, charset: 'alphabetic' });

app.locals.uniqueId = () => loadash.uniqueId('chat');

const ChatController = require('./Controllers/ChatController');

const IoExec = require('./Controllers/SocketController');

io.on('connection', (socket) => IoExec(io, socket));
app.use('/', ChatController);

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
