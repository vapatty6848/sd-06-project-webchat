const ChatService = require('../services/ChatService');
const formatMessage = require('../utils/formatMessage');

let users = [];

function handleMessage(socket, io) {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const formatedMessage = formatMessage(chatMessage, nickname);
    io.emit('message', formatedMessage.message);
    const savedMessage = await ChatService.CreateMessage(formatedMessage);
    console.log(savedMessage);
  });
}

function handleNewUser(socket, io) {
  socket.on('newUser', (user) => {
    users = [user, ...users];
    io.emit('users', users);
  });
}

function IoExec(io, socket) {
  handleNewUser(socket, io);

  socket.on('updateNickname', (user) => {
    // removed old user
    const newUsers = users.filter((el) => el.id !== user.id);

    // added new user
    users = [user, ...newUsers];
    io.emit('users', users);
  });

  handleMessage(socket, io);
}

module.exports = IoExec;
