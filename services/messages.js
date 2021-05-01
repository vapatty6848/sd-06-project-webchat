const connection = require('../models/connection');

const collection = 'messages';

const createMessage = async (timestamp, nickname, message) => connection()
  .then((db) => db.collection(collection).insertOne({ timestamp, nickname, message }));

const getMessages = async () => connection()
  .then((db) => db.collection(collection).find().toArray());

module.exports = {
  createMessage,
  getMessages,
};