const messageFormat = ({ chatMessage, nickname }) => {
  const date = new Date();
  const ddmmyyyy = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
  const fullDate = `${ddmmyyyy} ${date.toLocaleTimeString()}`;
  return `${fullDate} - ${nickname}: ${chatMessage}`;
};

module.exports = {
  messageFormat,
};