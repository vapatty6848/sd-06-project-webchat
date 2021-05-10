// const app = require('express')();
// const http = require('http').createServer(app);
// const cors = require('cors');
// const io = require('socket.io')(http, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// });
// const { getMsgs, saveMsgs } = require('./models/chatModel');

// const validateMsg = async (msg) => {
//   const { nickname, chatMessage } = msg;
    
//   const date = new Date().toLocaleString();
//   let time = date.substring(13, 11);
//   const saveToDB = { message: chatMessage, nickname, timestamp: date };
//   saveMsgs(saveToDB);

//   if (parseInt(time, 10) > 12) {
//     time = 'PM';
//   } else {
//     time = 'AM';
//   }
  
//   const userMessage = `${date} ${time} - ${nickname}: ${chatMessage}`;
//   const formattedMsg = userMessage.replace(/\//g, '-');
//   io.emit('message', formattedMsg);
// };

// app.use(cors());
// let onlineUsers = [];

// io.on('connection', async (socket) => {
//   const messages = await getMsgs();
//   socket.emit('allMessages', messages);

//   socket.on('getName', (nickname) => {
//     // console.log(nickname);
//     onlineUsers.push({ id: socket.id, nickname });
//     io.emit('onlineUsers', onlineUsers);
//   });

//   socket.on('updateName', (getName) => {
//     const newName = onlineUsers.find((user) => user.id === socket.id);
//     newName.nickname = getName;
//     onlineUsers = onlineUsers.map((user) => (user.id === socket.id ? newName : user));
//     io.emit('onlineUsers', onlineUsers);
//   });

//   socket.on('disconnect', () => {
//     const usersLeft = onlineUsers.filter((user) => user.id !== socket.id);
//     onlineUsers = usersLeft;
//     io.emit('onlineUsers', usersLeft);
//   });
  
//   socket.on('message', async (msg) => validateMsg(msg));
// });

// app.set('view engine', 'ejs');
// app.set('views', './views');

// app.get('/', (_req, res) => {
//   res.render('home');
// });

// http.listen('3000');

// io.emit('message', formattedMsg); emite para todos
// socket.emit - apenas quem mandou recebe
// socket.broadcast - todos recebem, menos quem mandou

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const routerMessage = require('./controllers/MessagesController');
const { createMessages } = require('./models/MessagesModel');
const {
  createUser,
  updateUser,
  getAllUsers,
  removeUser,
} = require('./models/UsersModel');

const port = 3000;
const time = () => {
  const dNow = new Date();
  const month = () => {
    if (dNow.getMonth() + 1 < 10) {
      return `0${dNow.getMonth() + 1}`;
    }
    return dNow.getMonth() + 1;
  };
  const min = () => {
    if (dNow.getMinutes() < 10) {
      return `0${dNow.getMinutes()}`;
    }
    return dNow.getMinutes();
  };
  const dia = dNow.getDate();
  const ano = dNow.getFullYear();
  const hr = dNow.getHours();
  const localdate = `${dia}-${month()}-${ano} ${hr}:${min()}`;
  return localdate;
};
const myTime = time();
const messages = async (socket) => {
  socket.on('message', async ({ nickname, chatMessage }) => {
    await createMessages(nickname, chatMessage, myTime);
    io.emit('message', `${myTime} ${nickname} ${chatMessage}`);
  });
};
io.on('connection', async (socket) => {
  messages(socket);
  socket.on('initialNickname', async ({ nickname, socketID }) => {
    await createUser(nickname, socketID);
    const allUsersBack = await getAllUsers();
    io.emit('teste', allUsersBack);
  });
  socket.on('updateNick', async ({ nickname, socketIdFront }) => {
    await updateUser(nickname, socketIdFront);
    const allUsersBack = await getAllUsers();
    io.emit('teste', allUsersBack);
  });
  socket.on('disconnect', async () => {
    await removeUser(socket.id);
    const allUsersBack = await getAllUsers();
    io.emit('teste', await allUsersBack);
  });
});
app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/', async (_req, res) => {
  const nickname = `${Math.random().toString().substr(2, 16)}`;
  const allUsersBack = await getAllUsers();
  res.render('home', { allUsersBack, nickname });
});
app.use(cors());
app.use(bodyParser.json());
app.use('/chat', routerMessage);
httpServer.listen(port, () =>
  console.log(`Example app listening on port ${port}!`));