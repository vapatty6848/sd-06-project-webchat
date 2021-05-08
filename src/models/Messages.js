const connection = require('./connection');

const saveMessage = async (message, nickname, timestamp) => connection()
    .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }));

const getAllMessages = () => connection()
  .then((db) => db.collection('messages').find().toArray());

module.exports = {
  saveMessage,
  getAllMessages,
}; 