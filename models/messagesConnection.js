const connection = require('./connection');

const messages = 'messages';

const saveMessage = async ({ chatMessage, nickname, dateAndHour }) => (
  connection().then((db) => db.collection(messages).insertOne({
    chatMessage,
    nickname,
    dateAndHour,
  }))
);

const messagesGetAll = async () => {
  const allMessages = await connection().then((db) => db.collection(messages).find().toArray());

  return allMessages;
};

module.exports = { saveMessage, messagesGetAll }; 
