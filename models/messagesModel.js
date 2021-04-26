const connection = require('./connection');

const collection = 'messages';

const saveMessage = async (message, nickname, timestamp) => {
  await connection().then((db) => 
    db.collection(collection).insertOne({ message, nickname, timestamp }));
};

const getMessages = async () => {
  const messages = await connection().then((db) => db.collection('messages')
    .find().toArray());

  return messages;
};

module.exports = {
  saveMessage,
  getMessages,
};
