const generateNickname = require('./generateNickname');

function handleNewConnection({ socket, users, io }) {
  const userNickname = generateNickname(16);
  console.log(`CONNECTION: Usuário ${socket.id} conectado. Nickname: ${userNickname}`);
  socket.emit('hello', userNickname);
  users.push({ socketId: socket.id, nickname: userNickname });
  console.log('Users:', users);
  io.emit('updateUsersList', users);
}

module.exports = handleNewConnection;
