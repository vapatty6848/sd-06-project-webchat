const connection = require('./connection');

const collection = 'messages';

const storeMessage = async (timestamp, nickname, message) => connection()
    .then((db) => db.collection(collection).insertOne({ timestamp, nickname, message }));

const getAllMessages = async () => connection()
    .then((db) => db.collection(collection).find().toArray());

module.exports = {
  storeMessage,
  getAllMessages,
};
