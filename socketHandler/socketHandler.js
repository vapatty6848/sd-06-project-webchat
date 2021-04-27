const getPrefix = require('../utils/getMessagePrefix');
const { saveMessage } = require('../models/messagesModel');

const sendMessage = async ({ nickname, chatMessage }, io) => {
  const { messagePrefix, convertedDate } = getPrefix(nickname);
  await saveMessage(chatMessage, nickname, convertedDate);
  const completeMessage = `${messagePrefix}${chatMessage}`;
  io.emit('message', completeMessage);
};

const getUsers = (users, socket) => {
  console.log('getUsers', users);
  const userId = socket.id;
  const newUser = users.find((user) => user.id === userId);
  const otherUsers = users.filter((user) => user.id !== userId);
  console.log('otherUsers', otherUsers);
  socket.emit('getUsers', otherUsers);
  socket.broadcast.emit('newUser', newUser);
};

const saveUser = ({ nickname, socket, users }) => {
  const { id } = socket;
  users.push({ nickname, id });
  getUsers(users, socket);
};

const updateNickname = ({ nickname, socket, users }) => {
  const { id } = socket;
  const userIndex = users.indexOf(users.find((user) => user.id === id));
  users.splice(userIndex, 1, { nickname, id });
};

module.exports = { sendMessage, saveUser, updateNickname, getUsers };