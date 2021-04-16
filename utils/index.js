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

const addZero = (i) => {
  const newInt = (i < 10) ? `0${i}` : i;
  return newInt;
};

function setTimestamp(order = '') {
  const date = new Date();
  const d = addZero(date.getDate());
  const m = addZero(date.getMonth());
  const y = addZero(date.getFullYear());

  const h = addZero(date.getHours());
  const min = addZero(date.getMinutes());
  const s = addZero(date.getSeconds());
  if (order === 'year-first') return `${y}-${m}-${d} ${h}:${min}:${s}`;
  return `${d}-${m}-${y} ${h}:${min}:${s}`;
}

const setupMessages = (msg) => {
  const messageFrontend = `${setTimestamp()} - ${msg.nickname}: ${msg.chatMessage}`;
  const messageBackend = {
    timestamp: setTimestamp('year-first'),
    nickname: msg.nickname,
    message: msg.chatMessage,
  };

  return { messageBackend, messageFrontend };
};

module.exports = {
  setTimestamp,
  addUserOnlineList,
  removeUserOnlineList,
  setupMessages,
};
