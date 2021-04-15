const chat = require('./chat.controllers');
const clearDB = require('./clearDB.controllers');
const users = require('./users.controllers');

module.exports = {
  chat,
  users,
  clearDB,
};
