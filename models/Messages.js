const connection = require('./connection');

const getAllMessages = async () => {
  const messages = await connection().then((db) => db.collection('messages').find().toArray());
  return messages;
};

const createMessage = async (nickname, message, date) => {
  const newMessage = await connection()
    .then((db) => db.collection('messages').insertOne({ nickname, message, date }));
  return (newMessage.ops[0]);
};

module.exports = {
  getAllMessages,
  createMessage,
};