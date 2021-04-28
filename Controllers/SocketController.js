const ChatService = require('../services/ChatService');
const formatMessage = require('../utils/formatMessage');

let users = [];

function handleMessage(socket, io) {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const formatedMessage = formatMessage(chatMessage, nickname);
    io.emit('message', formatedMessage.message);
    await ChatService.CreateMessage(formatedMessage);
    // console.log(savedMessage);
  });
}

function handleNewUser(socket, io) {
  socket.on('newUser', (user) => {
    const newUser = { id: socket.id, nickname: user.nickname };
    console.log('new user', socket.id);
    users = [newUser, ...users];
    io.emit('users', users);
  });
}

function IoExec(io, socket) {
  handleNewUser(socket, io);

  socket.on('updateNickname', ({ nickname }) => {
    // removed old user
    // const newUsers = users.filter((el) => el.id !== socket.id);
    const index = users.findIndex((el) => el.id === socket.id);
    // added new user
    console.log(users, 'antes');
    // users = [{ id: socket.id, nickname }, ...newUsers];
    console.log(users, 'depois');
    users.splice(index, 1, { id: socket.id, nickname });
    io.emit('updateNickname', users);
  });

  socket.on('disconnect', () => {
    const index = users.findIndex((el) => el.id === socket.id);
    // console.log(users, 'antes');
    users.splice(index, 1);
    // console.log(users, 'depois');
    io.emit('users', users);
  });
  
  handleMessage(socket, io);
}

module.exports = IoExec;
