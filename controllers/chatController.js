const { timeStamp, messagesList, msgFormat } = require('../utils');
const { getAllMessages, insertMessage } = require('../models/chatModel');

const sockets = [];

const nicknameSocket = (io, socket, nickname) => {
  console.log(`nickname: ${nickname}`);
  console.log(`socket.id: ${socket.id}`);
  const userIndex = sockets.findIndex((user) => user.id === socket.id);
  sockets[userIndex].nickname = nickname;
  io.emit('onlineUsers', sockets);
};

const onMessage = async (io, socket, { chatMessage, nickname }) => {
  let nicknameFromList;
  if (!nickname) {
  const userIndex = sockets.findIndex((user) => user.id === socket.id);
  nicknameFromList = sockets[userIndex].nickname;
  }
  const nick = (!nickname) ? nicknameFromList : nickname; 
  console.log(`nickname: ${nicknameFromList}`);
  await insertMessage({ message: chatMessage, nickname: nick, timestamp: timeStamp() });
  // io.emit('updatingList', true);
  const allMsgs = await getAllMessages();
  io.emit('message', JSON.stringify(messagesList(allMsgs)));
  // allMsgs.forEach((user) => io.emit('message', msgFormat(user)));
};

const chatController = async (io, socket) => {
  console.log(`${socket.id} conectou!`);  
  sockets.push({ id: socket.id });

  io.emit('onlineUsers', sockets);
  const usersList = await getAllMessages();
  io.emit('message', JSON.stringify(messagesList(usersList)));
  // usersList.forEach((user) => io.emit('message', msgFormat(user)));

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