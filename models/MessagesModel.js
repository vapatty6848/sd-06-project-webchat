const connection = require('./connection');

const getAll = async () =>
  connection().then((db) => db.collection('messages').find().toArray());

const create = async (message) => {
  await connection().then((db) => {
    db.collection('messages').insertOne({ ...message });
  });

  return {
    ...message,
  };
};

module.exports = {
  getAll,
  create,
};
