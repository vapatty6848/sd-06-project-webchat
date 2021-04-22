const connection = require('./connection');

const getAllMessages = async () => {
  const allMessages = await connection()
    .then((db) => db.collection('messages').find().toArray());
  return allMessages;
};

const saveMessage = async ({ chatMessage, nickname, timestamp }) => (
  connection()
    .then((db) => db.collection('messages').insertOne({ chatMessage, nickname, timestamp }))
);

module.exports = { saveMessage, getAllMessages };