const connection = require('./connection');

const getAll = async () => connection().then((db) => db.collection('messages').find().toArray());

const create = async (message) => connection()
  .then((db) => db.collection('messages')
  .insertOne(message));

module.exports = {
  getAll,
  create,
};
