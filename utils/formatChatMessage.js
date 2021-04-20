function formatChatMessage({ chatMessage, nickname, timestamp }) {
  const formattedMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
  // console.log(formattedMessage);
  return formattedMessage;
}

module.exports = formatChatMessage;
