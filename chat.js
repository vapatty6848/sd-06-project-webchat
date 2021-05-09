const socketIo = require('socket.io');
const db = require('./db');

const config = { cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] } };

const getMessagesFromDb = async () => {
  const msgs = await db.find();
  return msgs.map((msg) => `${msg.timestamp} ${msg.nickname} ${msg.message}`);
};

const prepareMessageAndSave = async (messageObj) => {
  const dateHour = new Date();

    let day = dateHour.getDate();
    day = day < 10 ? `0${day}` : day;

    let month = dateHour.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;

    const year = dateHour.getFullYear();
    const hour = dateHour.toLocaleTimeString();
    const date = `${day}-${month}-${year}`;
    const message = `${date} ${hour} ${messageObj.nickname} ${messageObj.chatMessage}`;

    await db.create(messageObj.chatMessage, messageObj.nickname, `${date} ${hour}`);

    return message;
};

let onlineUsers = [];

const removeNicknameFromOnlineUsers = (nickname) => {
  const index = onlineUsers.indexOf(nickname);
  if (index >= 0) {
    onlineUsers = [...onlineUsers.slice(0, index), ...onlineUsers.slice(index + 1)];
  }
  return onlineUsers;
};

const changeNicknameOnlineUsers = (oldNickname, newNickname) => {
  const index = onlineUsers.indexOf(oldNickname);
  if (index >= 0) {
    onlineUsers = [...onlineUsers.slice(0, index), newNickname,
      ...onlineUsers.slice(index + 1)];
  }
  return onlineUsers;
};

const addNicknameOnlineUsers = (nickname) => {
  onlineUsers.push(nickname);
  return onlineUsers;
};

const chat = (http) => {
  const io = socketIo(http, config);

  return io.on('connection', (socket) => {
    let username = '';
    socket.on('setNickname', async (nickname) => {
      username = nickname;
      io.emit('onlineUsers', addNicknameOnlineUsers(nickname));
      socket.emit('recover', await getMessagesFromDb());
    });

    socket.on('disconnect', () =>
      io.emit('onlineUsers', removeNicknameFromOnlineUsers(username)));

    socket.on('message', async (messageObj) => {      
      io.emit('message', await prepareMessageAndSave(messageObj));
    });

    socket.on('nicknameChange', (nickname) => {
      io.emit('onlineUsers', changeNicknameOnlineUsers(username, nickname));
      username = nickname;
    });
  });
};

module.exports = chat; 