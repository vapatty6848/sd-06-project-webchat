const express = require('express');
const cors = require('cors');
const dateFormat = require('dateformat');

const PORT = 3000;
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

const usersList = [];

const findUser = (listNickname, id, nickname) => {
  const detectUser = listNickname.findIndex((user) => user.id === id);
  listNickname.splice(detectUser, 1, { id, nickname });
    return listNickname;
};

const dateAndTime = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');

io.on('connection', (socket) => {
  // console.log('socket', socket);
  console.log(`usuário conectado ${socket.id}`);

  socket.on('connectedUsers', ({ id, nickname }) => {
    usersList.push({ id, nickname });
    console.log(usersList);
    io.emit('connectedUsers', (usersList));
  });

  socket.on('nickname', ({ nick }) => {
    const userList = findUser(usersList, socket.id, nick);
    console.log(userList);
    io.emit('nickname', (userList));
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const newMessage = `${dateAndTime} - ${nickname}: ${chatMessage}`;
    // console.log(newMessage);
    io.emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log(`usuário desconectado ${socket.id}`);
  });
});

app.get('/', async (_req, res) => res.render('home'));

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));