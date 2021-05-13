const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const randomize = require('randomatic');
const { format } = require('date-fns');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const Messages = require('./models/messages');

const PORT = parseInt(process.env.PORT, 10) || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());

io.on('connection', async (socket) => {
  const history = await Messages.getAll();
  console.log('history messgaes from socket: ', history);
  socket.emit('historyMessages', { history });
  socket.emit('randomName', { userName: randomize('Aa0', 16) });
  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;
    const formattedDate = format(new Date(), 'dd-MM-yyyy KK:mm:ss aa');
    io.emit('message', { timestamp: formattedDate, message: chatMessage, nickname });
    Messages.create({ message: chatMessage, nickname, timestamp: formattedDate });
  });
});

app.get('/', (_req, res) => {
  res.render('chathome');
});

http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}.`));
