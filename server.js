const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const { format } = require('date-fns');

const cors = require('cors');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = parseInt(process.env.PORT, 10) || 3000;

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;
    const formattedDate = format(new Date(), 'dd-MM-yyyy KK:mm:ss aa');
    const formattedMessage = `${formattedDate} - ${nickname}: ${chatMessage}`;
    io.emit('serverMessage', formattedMessage);
  });
});

/**
 * io.emit manda pra todos
 * socket.emit manda para um específico
 * broadcast.emit manda para todos menos para que enviou
 */

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen(PORT, () => console.log(`escutando a porta ${PORT}!`));
