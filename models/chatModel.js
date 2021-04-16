const connection = require('./connection');

const getAll = async () => {
  return connection().then((db) => db.collection('messages').find().toArray());
};

module.exports = {
  getAll,
};
