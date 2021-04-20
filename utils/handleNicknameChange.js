const usersList = require('../server.js');

function handleNicknameChange({ socket, newNickname, io }) {
  const index = usersList.users.findIndex((user) => user.socketId === socket.id);
  usersList.users[index].nickname = newNickname;
  console.log('Nickname alterado. Lista de Usuários', usersList.users);
  io.emit('usersUpdate', usersList.users);
}

module.exports = handleNicknameChange;
