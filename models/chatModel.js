const connection = require('./connection');

const saveMessage = async (message) => {
  const newMessage = await connection().then((db) =>
    db.collection('messages').insertOne({ message }));

  return newMessage;
};

const getAllMessages = async () => {
  const getMessages = await connection().then((db) => db.collection('messages').find().toArray());
  return getMessages;
};

module.exports = {
  saveMessage,
  getAllMessages,
};