const usersList = require('../server.js');

function handleNicknameChange({ socket, newNickname, io }) {
  const userIndex = usersList.users.findIndex((user) => user.socketId === socket.id);
  usersList.users[userIndex].nickname = newNickname;
  io.emit('updateUsersList', usersList.users);
}

module.exports = handleNicknameChange;
