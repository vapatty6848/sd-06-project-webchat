const connection = require('./connection');

const getAll = async() => {
  await connection().then((db) => db.collection('messages').find().toArray());
};

module.exports = {
  getAll,
};
