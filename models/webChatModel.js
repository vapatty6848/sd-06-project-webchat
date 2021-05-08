const connection = require('./connection');

const getAll = async () => {
    return await connection().then((db) => db.collection('messages').find().toArray());
};

const create = async ({ message }) => connection()
  .then((db) => db.collection('messages')
  .insertOne({ message }));

module.exports = {
  getAll,
  create,
};
