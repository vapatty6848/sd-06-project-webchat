const connection = require('./connection');

const createMessage = async (message) => {
  const newMsg = await connection().then((db) => db.collection('messages').insertOne(message));
  return newMsg;
};

const getAllMessages = async () => {
  const messages = await connection().then((db) => db.collection('messages').find().toArray());
  return messages;
};

module.exports = {
  createMessage,
  getAllMessages,
};