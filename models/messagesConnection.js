const connection = require('./connection');

const messages = 'messages';

const saveMessage = async (message, nickname, timestamp) => (
  connection().then((db) => db.collection(messages).insertOne({
    message,
    nickname,
    timestamp,
  }))
);

const messagesGetAll = async () => {
  const allMessages = await connection().then((db) => db.collection(messages).find().toArray());

  return allMessages;
};

module.exports = { saveMessage, messagesGetAll }; 
