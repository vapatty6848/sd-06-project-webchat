const usersList = require('../server.js');

function handleNewConnection({ userNickname, socket }) {
  usersList.users.push({ socketId: socket.id, nickname: userNickname });
  console.log('Usuário conectado, lista de usuários: ', usersList.users);
}

module.exports = handleNewConnection;
