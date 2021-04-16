const connection = require('./connection');

const getAllUsers = async () => {
  const users = await connection().then((db) => db.collection('users').find().toArray());
  return users;
};

const findUserById = async (id) => {
  const user = await connection()
    .then((db) => db.collection('users').findOne({ id }));
  return user;
};

const createUser = async (id, nickname) => {
  const newUser = await connection()
    .then((db) => db.collection('users').insertOne({ id, nickname }));
  return (newUser.ops[0]);
};

const removeUser = async (id) => {
  const excludedUser = await connection()
    .then((db) => db.collection('users').findOneAndDelete({ id }));
  return excludedUser;
};

module.exports = {
  createUser,
  findUserById,
  getAllUsers,
  removeUser,
};