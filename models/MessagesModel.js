const connection = require('./connection');

const registerMessage = async (message, nickname, timestamp) => {
  const insertedMessage = await connection().then((db) => 
    db.collection('messages').insertOne({ message, nickname, timestamp }));
  return insertedMessage;
};

const getMessageHistory = async () => connection().then((db) => db
  .collection('messages').find().toArray());

module.exports = {
  registerMessage,
  getMessageHistory,
};
