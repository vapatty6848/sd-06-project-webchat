const connection = require('./connection');

const COLLECTION_NAME = 'messages';

const getAll = async () => connection()
    .then((database) => database.collection(COLLECTION_NAME).find().toArray());

const create = async (message, nickname, timestamp) => {
  const newMessage = await connection()
    .then((db) => db.collection(COLLECTION_NAME)
      .insertOne({ message, nickname, timestamp }));
  return newMessage.ops[0];
};

module.exports = {
  getAll,
  create,
};