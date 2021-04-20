const connection = require('./connection');

const getAll = async () =>
  connection().then((db) => db.collection('messagesHistory').find().toArray());

const create = async (message) => {
  await connection().then((db) => {
    db.collection('messagesHistory').insertOne({ ...message });
  });

  return {
    ...message,
  };
};

module.exports = {
  getAll,
  create,
};
