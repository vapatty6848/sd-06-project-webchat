const connection = require('./connection');

const getAllUsers = async () => {
  const allUsers = await connection()
    .then((db) => db.collection('users').find().toArray());
  return allUsers;
};

const create = async (id, nickname) => {
  const newUser = await connection()
    .then((db) => db.collection('users').insertOne({ id, nickname }));
  const newUserData = newUser.ops[0];
  return newUserData;
};

const updateUser = async ({ id, nickname }) => {
  const userUpdated = await connection()
    .then((db) => db.collection('users').findOneAndUpdate(
      { id },
      { $set: { nickname } },
      { returnOriginal: false },
    ));
  return userUpdated.value;
};

const findUserById = async (id) => {
  const userById = await connection().then((db) => db.collection('users').findOne({ id }));
  return userById;
};

const removeUserById = async (id) => {
  const userDeleted = await connection()
    .then((db) => db.collection('users').findOneAndDelete({ id }));
  return userDeleted;
};

module.exports = {
  getAllUsers,
  create,
  updateUser,
  findUserById,
  removeUserById,
};
