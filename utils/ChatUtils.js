const crypto = require('crypto');

// const userName = document.querySelector('#username');
function createNickname() {
  const token = `USER__${crypto.randomBytes(5).toString('hex')}`;
  return token; 
}

const generateData = () => {
  const data = new Date().toLocaleDateString('en-GB');
  const time = new Date().toLocaleTimeString('en-GB');
  const dateTime = (`0${data} ${time}`).replace(/[/]/g, '-');
  return dateTime;
};

const updateUsers = (users, user) => {
  const newUsers = users;
  const userIndex = users.findIndex((upUser) => upUser.id === user.id);
  if (userIndex !== -1) newUsers[userIndex] = user;
  return newUsers;
};

const removeUser = (users, socket) => {
  const userIndex = users.findIndex((user) => user.id === socket.id);
  if (userIndex !== -1) users.splice(userIndex, 1);
};

module.exports = { 
  createNickname,
  generateData,
  updateUsers,
  removeUser,
 };