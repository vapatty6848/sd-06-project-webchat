const Messages = require('../models/Messages');

async function saveChatMeesage({ chatMessage, nickname, timestamp }) {
  await Messages.create(chatMessage, nickname, timestamp);
}

module.exports = saveChatMeesage;
