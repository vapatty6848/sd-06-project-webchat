const moment = require('moment');
const formatChatMessage = require('./formatChatMessage');
const saveChatMessage = require('./saveChatMessage');

function handleMessageSent({ io, chatMessage, nickname }) {
  const timestamp = moment().format('DD-MM-YYYY HH:mm:ss');
  const formattedMessage = formatChatMessage({ chatMessage, nickname, timestamp });
  saveChatMessage({ chatMessage, nickname, timestamp });
  io.emit('message', formattedMessage);
}

module.exports = handleMessageSent;
