const connection = require('./connection');

const getAll = async () => connection().then((db) => db.collection('messages').find().toArray());

const create = async ({ message, nickname, timestamp }) => connection()
  .then((db) => db.collection('messages')
  .insertOne({ message, nickname, timestamp }));

module.exports = {
  getAll,
  create,
};
