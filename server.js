// Faça seu código aqui
const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['POST, GET'],
  },
});

const PORT = process.env.PORT || 3000;

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', (req, res) => {
   res.render('index');
});

const getDate = () => {
  const date = new Date().getTime();
  const parseDate = new Date(date).toLocaleDateString();
  return parseDate;
};

const getHour = () => {
  const time = new Date();
  const parseHour = time.getHours() - 12;
  let code = 'PM';
  if (parseHour < 0) {
    code = 'AM';
    const hour = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ${code}`;
    return hour;
  }
  if (parseHour === 0) {
    const hour = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ${code}`;
    return hour;
  }
  const hour = `${parseHour}:${time.getMinutes()}:${time.getSeconds()} ${code}`;
  return hour;
};

io.on('connection', (socket) => {
  console.log(`entrou com id:${socket.id}`);
  socket.on('disconnect', () => {
    console.log('desconectado');  
  });

  socket.on('message', (message) => {
    const msg = `${getDate()} ${getHour()} ${message.chatMessage}, ${message.nickname}`;
    io.emit(msg);
  });
});

http.listen(PORT, () => console.log(`ouvindo na porta: ${PORT}`));
