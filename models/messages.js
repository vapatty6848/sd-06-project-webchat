const connection = require('./connection');

const saveMessages = async ({ chatMessage, nickname, timestamp }) => {
  await connection().then((db) => db.collection('messages')
    .insertOne({ chatMessage, nickname, timestamp }));
};

const getMessages = async () => {
  const messages = await connection().then((db) => db.collection('messages')
    .find().toArray());

  return messages;
};

module.exports = { saveMessages, getMessages };
