const moment = require('moment');

const addUserOnlineList = (usersOnline, user, prevUser) => {
  const prevUserIndex = usersOnline.indexOf(prevUser);
  if (prevUserIndex >= 0) { usersOnline.splice(prevUserIndex, 1); }

  const userAlreadyListed = usersOnline.indexOf(user);
  const newList = (userAlreadyListed >= 0) ? [...usersOnline] : [...usersOnline, user];
  return newList;
};

const removeUserOnlineList = (usersOnline, user) => {
  const userIndex = usersOnline.indexOf(user);
  const newList = [...usersOnline];
  if (userIndex >= 0) { newList.splice(userIndex, 1); }
  return newList;
};

const setupMessages = (msg) => {
  const frontendTimestamp = moment(msg.timestamp).format('DD-MM-yyyy hh:mm:ss');
  const backendTimestamp = moment(msg.timestamp).format('yyyy-MM-DD hh:mm:ss');
  const messageFrontend = `${frontendTimestamp} - ${msg.nickname}: ${msg.chatMessage}`;
  const messageStored = `${frontendTimestamp} - ${msg.nickname}: ${msg.message}`;
  const messageBackend = {
    timestamp: backendTimestamp,
    nickname: msg.nickname,
    message: msg.chatMessage,
  };

  return { messageBackend, messageFrontend, messageStored };
};

module.exports = {
  addUserOnlineList,
  removeUserOnlineList,
  setupMessages,
};
