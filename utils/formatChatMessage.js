function formatChatMessage({ chatMessage, nickname, timestamp }) {
  const formattedMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
  return formattedMessage;
}

module.exports = formatChatMessage;
