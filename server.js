const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chatRouter = require('./routes/chat.routes');
const errorHandler = require('./middlewares/errorHandler');
const { loginHandler, chatHandler } = require('./sockets');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(chatRouter);
app.use(errorHandler);

const onConnection = (socket) => {
  loginHandler(io, socket);
  chatHandler(io, socket);
};

io.on('connection', onConnection);

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
