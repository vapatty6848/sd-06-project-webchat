const formatMessage = (date, nickname, message) => {
  const formattedMessage = `<li data-testid='message'>
  <strong>${date} - ${nickname}</strong>: ${message}
  </li>`;

  return formattedMessage;
};

module.exports = formatMessage;
