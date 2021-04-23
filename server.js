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

app.get('/', async (req, res) => res.render('index'));

const getDate = () => {
//   const date = new Date().getTime();
//   const parseDate = new Date(date).toLocaleDateString();
  const date = new Date();
  const parseDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  return parseDate;
};

const getHour = () => {
  const time = new Date();
  const parseHour = time.getHours() - 12;
  const parseMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();  
  let code = 'PM';
  if (parseHour < 0) {
    code = 'AM';
    const hour = `${time.getHours()}:${parseMinutes}:${time.getSeconds()} ${code}`;
    return hour;
  }
  if (parseHour === 0) {
    const hour = `${time.getHours()}:${parseMinutes}:${time.getSeconds()} ${code}`;
    return hour;
  }
  const hour = `${parseHour}:${parseMinutes}:${time.getSeconds()} ${code}`;
  return hour;
};

io.on('connection', (socket) => {
  const guest = socket.id.substring(0, 16);
  const newUser = { id: Math.random().toString(36).substring(0, 16) };
  console.log(`entrou com id:${newUser.id}`);
  io.emit('showUser', guest);

  socket.on('disconnect', () => {
    console.log('desconectado');  
  });

  socket.on('message', (message) => {
    const msg = `${getDate()} ${getHour()} ${message.nickname}: ${message.chatMessage}`;
    io.emit('message', msg);
  });
});

http.listen(PORT, () => console.log(`ouvindo na porta: ${PORT}`));
