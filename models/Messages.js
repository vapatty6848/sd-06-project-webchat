const connection = require('./connection');

const getAll = async () => {
  const result = await
    connection().then((db) => db.collection('messages').find().toArray());
  return result;
};

const create = async (message, nickname, timestamp) => {
  const result = await
    connection().then((db) => db.collection('messages')
      .insertOne({ message, nickname, timestamp }));
  return result.ops[0];
};

module.exports = {
  getAll,
  create,
};
