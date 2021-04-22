const app = require('express')();
const express = require('express');
const httpServer = require('http').createServer(app);
const cors = require('cors');
// const dateFormat = require('dateformat');
const moment = require('moment');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

const port = 3000;

app.use(cors());
app.use(express.static(`${__dirname}/assets/`)); 

const Message = require('./models/MessagesModel');
const Users = require('./models/UsersModel');

const generateRandomNickname = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i += 1) {
    str += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return str;
};

app.get('/', async (_req, res) => {
  const messages = await Message.getMessageHistory();
  const users = await Users.getUsers();
  // console.log('users get', users);
  res.render('home/index', { messages, users: [{ nickname: 'user 1' }, ...users] });
});

app.set('view engine', 'ejs');

const dateNow = new Date().getTime();
const date = moment(dateNow).format('DD-MM-yyyy h:mm:ss A');
// const date = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss');

/* const onConnect = async (socket, nickname, ioConnection) => {
  await Users.registerUser(socket.id, nickname);
  const getUsers = await Users.getUsers();
  ioConnection.emit('connectedUsers', getUsers); 
}; */

io.on('connection', async (socket) => {
  await Users.registerUser(socket.id, generateRandomNickname(16));
  const getUsers = await Users.getUsers();
  io.emit('connectedUsers', getUsers); 

  // Esse socket recebe do frontend (canal message) a mensagem que será emitida para todos os users online
  socket.on('message', async ({ nickname, chatMessage }) => {
    await Message.registerMessage(chatMessage, nickname, date);
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });
  // Recebe do Frontend o usuário com o nickname editado
  socket.on('updateNickname', async (user) => {
    // const socketId = user[0].id;
    // const newNickname = user[0].nickname;
    await Users.updateUser(user[0].id, user[0].nickname);
    const getUpdatedUsers = await Users.getUsers();
    io.emit('connectedUsers', getUpdatedUsers);
  });
  // Remove o usuário quando ele desconecta
    socket.on('disconnect', async () => {
    await Users.deleteDisconnectedUser(socket.id);
    const users = await Users.getUsers();
    io.emit('connectedUsers', users);
  });
});

httpServer.listen(port, () => console.log(`Example app listening on ${port}!`));
