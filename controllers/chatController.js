const { timeStamp, msgFormat } = require('../utils');
const { insertMessage } = require('../models/chatModel');

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

const onMessage = async (io, _socket, { chatMessage, nickname }) => {
  const timestamp = timeStamp();
  const msg = msgFormat({ message: chatMessage, nickname, timestamp });
  await insertMessage({ message: chatMessage, nickname, timestamp });
  // const allMsgs = await getAllMessages();
  io.emit('message', msg);
};

const chatController = async (io, socket) => {
  console.log(`${socket.id} conectou!`);  
  // sockets.push({ id: socket.id, nickname: socket.id });

  if (sockets.length > 0) io.emit('onlineUsers', sockets);

  // io.emit('onlineUsers', sockets);
  // const usersList = await getAllMessages();
  // io.emit('message', messagesList(usersList));

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