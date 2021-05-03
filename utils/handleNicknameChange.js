const usersList = require('../models/UsersList');

function handleNicknameChange({ socket, newNickname, io }) {
  const index = usersList.findIndex((user) => user.socketId === socket.id);
  usersList[index].nickname = newNickname;
  console.log('Nickname alterado. Lista de Usuários', usersList);
  io.emit('usersUpdate', usersList);
}

module.exports = handleNicknameChange;
