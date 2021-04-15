const controllers = require('../controllers/chat.controllers');

const utils = require('../utils');

let usersOnline = [];
let userNickname;

const userLogin = async ({ user, prevUser = '' }) => {
  usersOnline = utils.addUserOnlineList([...usersOnline], user, prevUser);
  userNickname = user;
  // io.emit('usersOnline', usersOnline);
};

const clientMessage = async (msg) => {
  const timestamp = `${utils.setTimestamp()}`;
  const message = { timestamp, nickname: msg.nickname, message: msg.chatMessage };
  await controllers.create(message);
  // io.emit('message', message);
};

const disconnect = () => {
  usersOnline = utils.removeUserOnlineList(usersOnline, userNickname);
  // io.emit('usersOnline', usersOnline);
  console.log('Usuário saiu do chat.');
};

module.exports = {
  userLogin,
  clientMessage,
  disconnect,
};
