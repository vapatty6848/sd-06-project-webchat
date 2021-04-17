const connection = require('./connection');

const create = async (nickname) => {
  const newUser = await connection()
    .then((db) => db.collection('messages').insertOne({ nickname }));

  return newUser.ops[0];
};

const getAll = async () => {
  const allUsers = await connection()
    .then((db) => db.collection('messages').find().toArray());

  return allUsers;
};

module.exports = {
  create,
  getAll,
};