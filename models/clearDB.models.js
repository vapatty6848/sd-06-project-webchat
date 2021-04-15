const connection = require('./connection');

const clear = async () => {
  await connection()
    .then((db) => db.collection('messages').deleteMany({}))
    .catch((err) => err);
  await connection()
    .then((db) => db.collection('usersOnline').deleteMany({}))
    .catch((err) => err);
  return true;
};

module.exports = {
  clear,
};