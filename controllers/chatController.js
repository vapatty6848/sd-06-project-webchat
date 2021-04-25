const { timeStamp, messagesList } = require('../utils');
const { getAllMessages, insertMessage } = require('../models/chatModel');

const sockets = [];

const nicknameSocket = (io, socket, nickname) => {
  console.log(`nickname: ${nickname}`);
  console.log(`socket.id: ${socket.id}`);
  const userIndex = sockets.findIndex((user) => user.id === socket.id);
  if (userIndex > -1) {
    sockets[userIndex].nickname = nickname;
  } else {
    sockets.push({ id: socket.id, nickname });
  }
  io.emit('onlineUsers', sockets);
};

const onMessage = async (io, socket, { chatMessage, nickname }) => {
  await insertMessage({ message: chatMessage, nickname, timestamp: timeStamp() });
  const allMsgs = await getAllMessages();
  io.emit('messageHistory', messagesList(allMsgs));
};

const chatController = async (io, socket) => {
  console.log(`${socket.id} conectou!`);  
  // sockets.push({ id: socket.id, nickname: socket.id });

  // if (sockets.length > 1) io.emit('onlineUsers', sockets);
  io.emit('onlineUsers', sockets);
  const usersList = await getAllMessages();
  io.emit('messageHistory', messagesList(usersList));

  // socket.broadcast.emit('message', message({ chatMessage: 'se conectou', nickname: socket.id }));

  socket.on('disconnect', () => {
    const userIndex = sockets.findIndex((user) => user.id === socket.id);
    sockets.splice(userIndex, 1);
    io.emit('onlineUsers', sockets);
    console.log(`${socket.id} desconectado!`);
  });

  socket.on('message', ({ chatMessage, nickname }) => onMessage(io, socket, { 
    chatMessage, nickname, 
  }));

  socket.on('nickname', ({ nickname }) => nicknameSocket(io, socket, nickname));
};

module.exports = {
  chatController,
};