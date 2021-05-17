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

const usersList = [];

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());

const onMessage = (message) => {
  const { chatMessage, nickname } = message;
  const formattedDate = format(new Date(), 'dd-MM-yyyy KK:mm:ss aa');
  const formattedMessage = `${formattedDate} - ${nickname}: ${chatMessage}`;
  io.emit('message', formattedMessage);
  Messages.create({ message: chatMessage, nickname, timestamp: formattedDate });
};

const onNameChange = ({ oldName, newName }) => {
  const userIndex = usersList.findIndex((user) => user.userName === oldName);
  usersList[userIndex].userName = newName;
  io.emit('usersList', { connectedList: usersList.map((user) => user.userName) });
};

io.on('connection', async (socket) => {
  try {
    const loginName = randomize('Aa0', 16);
    const history = await Messages.getAll();
    usersList.push({ socketId: socket.id, userName: loginName });
    socket.emit('historyMessages', { history });
    socket.emit('randomName', { userName: loginName });
    io.emit('usersList', { connectedList: usersList.map((user) => user.userName) });
    
    socket.on('message', onMessage);
    socket.on('nameChange', onNameChange);
  
    socket.on('disconnect', () => {
      const userIndex = usersList.findIndex((user) => user.socketId === socket.id);
      usersList.splice(userIndex, 1);
      io.emit('usersList', { connectedList: usersList.map((user) => user.userName) });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get('/', (_req, res) => {
  res.render('chathome');
});

http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}.`));
