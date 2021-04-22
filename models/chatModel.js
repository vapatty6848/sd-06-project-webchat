const conn = require('./connection');

const getAllMessages = async () => conn()
  .then((db) => db.collection('messages').find({}).toArray())
  .catch((err) => err);

const insertMessage = async (message) => conn()
  .then((db) => db.collection('messages').insertOne(message))
  .catch((err) => err);

module.exports = {
  getAllMessages,
  insertMessage,
};