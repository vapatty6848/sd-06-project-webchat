const usersList = require('../models/UsersList');

function handleNewConnection({ socket, io, userNickname }) {
  usersList.push({ socketId: socket.id, nickname: userNickname });
  console.log('Usuário conectado, lista de usuários: ', usersList);
  io.emit('usersUpdate', usersList);
}

module.exports = handleNewConnection;
