const connection = require('./connection');

const renderMessages = async () => connection()
  .then((db) => db.collection('messages').find().toArray());

const createMessages = async (message, nickname, timestamp) => connection()
  .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }));

module.exports = {
  renderMessages,
  createMessages,
};
