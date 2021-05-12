const connection = require('./connection');

const collection = 'messages';

const newMessage = async (time, nickname, message) => connection()
    .then((db) => db.collection(collection).insertOne({ time, nickname, message }));

const renderMessages = async () => connection()
    .then((db) => db.collection(collection).find().toArray());

module.exports = {
  newMessage,
  renderMessages,
};