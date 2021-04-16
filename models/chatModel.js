const connection = require('./connection');

const getAll = async () => connection().then((db) => db.collection('messages').find().toArray());

module.exports = {
  getAll,
};
