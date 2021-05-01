// Faça seu código aqui
// codigo consultado no course

const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');
const createHash = require('hash-generator');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const model = require('./models/model');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

const hashLength = 16;

// sugestão do Gabriel Coruja: usar um array para atualizar nicks (req 4)
const users = [];

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    const now = moment(Date()).format('DD-MM-YYYY hh:mm:ss');
    const msgToDB = { ...msg };
    msgToDB.timestamp = now; model.create(msgToDB);
    io.emit('message', `${now} ${msg.nickname} ${msg.chatMessage}`);
  });
  socket.on('newUser', () => {
    const nickname = createHash(hashLength);
    const user = { id: socket.id, nickname };
    users.push(user);
    io.emit('nickname', user);
  });
  socket.on('update', (nickname) => {
    // model.updateUser(nickname);
    const user = { id: socket.id, nickname };
    const index = users.findIndex((elem) => elem.id === socket.id);
    users.splice(index, 1); users.push(user); console.log(users);
    io.emit('updateUser', user);
  });
});

app.get('/', async (_req, res) => {
  const msgs = await model.get();
  res.render('chat', { msgs, users });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
