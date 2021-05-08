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

const chat = (http) => {
  const io = socketIo(http, config);

  return io.on('connection', (socket) => {
    socket.on('setNickname', async (nickname) => {
      socket.emit('welcome', nickname);
      socket.emit('recover', await getMessagesFromDb());
    });
    
    // socket.broadcast.emit('newUser', { message: 'New user on chat!' });
    socket.on('disconnect', () => console.log('Disconnected'));

    socket.on('message', async (messageObj) => {      
      io.emit('message', await prepareMessageAndSave(messageObj));
    });

    socket.on('nicknameChange', () => console.log('Nickname'));
  });
};

module.exports = chat;