const Messages = require('../models/Messages');

function saveChatMessage({ chatMessage, nickname, timestamp }) {
  Messages.create(chatMessage, nickname, timestamp);
}

module.exports = saveChatMessage;
