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

const PORT = parseInt(process.env.PORT, 10) || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;
    const formattedDate = format(new Date(), 'dd-MM-yyyy KK:mm:ss aa');
    const formattedMessage = `${formattedDate} - ${nickname}: ${chatMessage}`;
    io.emit('serverMessage', formattedMessage);
  });
});

app.get('/', (_req, res) => {
  res.render('chathome');
});

http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}.`));
