const connection = require('./connection');

const saveMessage = async (message, nickname, date) => connection()
    .then((db) => db.collection('messages').insertOne({ message, nickname, date }));

const getAllMessages = () => connection()
  .then((db) => db.collection('messages').find().toArray());

module.exports = {
  saveMessage,
  getAllMessages,
}; 