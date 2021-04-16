const formatMessage = ({ date, nickname, chatMessage }) => {
  const formatedMessage = `${date} - ${nickname} ${chatMessage}`;
  return formatedMessage;
};

module.exports = formatMessage;
