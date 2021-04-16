const connection = require('./connection');

const create = async (message) => {
  const newMessage = await connection()
    .then((db) => db.collection('messages').insertOne(message));

  return newMessage;
};

const getAll = async () => {
  const messages = await connection()
    .then((db) => db.collection('messages').find().toArray());

  return messages;
};

module.exports = {
  create,
  getAll,
};
