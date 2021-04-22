const messageFormat = ({ chatMessage, nickname }) => {
  const date = new Date();
  const formatedDay = `0${date.getDate()}`.slice(-2);
  const formatedMonth = `0${date.getMonth() + 1}`.slice(-2);
  const ddmmyyyy = `${formatedDay}-${formatedMonth}-${date.getFullYear()}`;
  const fullDate = `${ddmmyyyy} ${date.toLocaleTimeString()}`;
  return `${fullDate} - ${nickname}: ${chatMessage}`;
};

const randomNickname = () => {
  const rand = () => Math.random().toString(36).replace('.', '');
  return (rand() + rand()).substr(2, 16);
};

module.exports = {
  messageFormat,
  randomNickname,
};