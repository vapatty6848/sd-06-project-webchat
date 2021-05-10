const connection = require('./connection');

const createHistory = async (nickname, message, timestamp) => {
  const creation = await connection()
    .then((db) => db.collection('messages').insertOne({ nickname, message, timestamp }));
  return creation;
};

const getAllMessages = async () => {
  const getMessages = await connection()
    .then((db) => db.collection('messages').find().toArray());
  console.log(getMessages);
  return getMessages;
};

module.exports = {
  createHistory,
  getAllMessages,
};