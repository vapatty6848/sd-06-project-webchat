const usersList = require('../server.js');

function handleNicknameChange({ socket, newNickname, io }) {
  const index = usersList.users.findIndex((user) => user.socketId === socket.id);
  usersList.users[index].nickname = newNickname;
  console.log('Lista com nicknames?', usersList.users);
  io.emit('usersUpdate', usersList.users);
}

module.exports = handleNicknameChange;
