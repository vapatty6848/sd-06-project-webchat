const connection = require('./connection');

const COLLECTION_NAME = 'messages';

const getAll = async () => {
  const allMessages = await connection()
    .then((db) => db.collection(COLLECTION_NAME)
      .find().toArray());

  return allMessages;
};

const create = async (message, nickname, timestamp) => {
  const newMessage = await connection()
    .then((db) => db.collection(COLLECTION_NAME)
      .insertOne({ message, nickname, timestamp }));
  
  const newMessageData = newMessage.ops[0];
  return newMessageData;
};

module.exports = {
  getAll,
  create,
};
