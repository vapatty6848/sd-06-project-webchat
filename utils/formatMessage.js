const formatMessage = ({ timestamp, nickname, chatMessage }) => (
  `${timestamp} - ${nickname} said: ${chatMessage}`
);

module.exports = formatMessage;