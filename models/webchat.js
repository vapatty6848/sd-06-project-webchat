const conn = require('./connection');

const getAll = async () => {
  const messages = await conn()
    .then((db) => db.collection('messages').find().toArray());
  return messages;
};

const postMessages = async (message, nickname, timestamp) => {
  const messages = await conn()
    .then((db) => db.collection('messages').insertOne({ nickname, message, timestamp }));
  return messages;
};

module.exports = {
  getAll,
  postMessages,
};
