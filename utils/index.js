const msgFormat = ({ message, nickname, timestamp }) => `${timestamp} - ${nickname}: ${message}`;

const messagesList = (messages) => messages.map((each) => {
  const result = JSON.stringify(msgFormat({ 
    message: each.message, nickname: each.nickname, timestamp: each.timestamp, 
  })).replace(/"/g, '');
  return result;
});

const randomNickname = () => {
  const rand = () => Math.random().toString(36).replace('.', '');
  return (rand() + rand()).substr(2, 16);
};

const timeStamp = () => {
  const date = new Date();
  const formatedDay = `0${date.getDate()}`.slice(-2);
  const formatedMonth = `0${date.getMonth() + 1}`.slice(-2);
  const ddmmyyyy = `${formatedDay}-${formatedMonth}-${date.getFullYear()}`;
  const fullDate = `${ddmmyyyy} ${date.toLocaleTimeString()}`;
  return fullDate;
};

module.exports = {
  msgFormat,
  randomNickname,
  timeStamp,
  messagesList,
};