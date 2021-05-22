const connection = require('./connection');

const createUser = async (nickname, socketID) => {
  const { insertedId } = await connection()
    .then((db) => db.collection('users').insertOne({ nickname, socketID }));
  return {
    _id: insertedId,
    nickname,
    socketID,
  };
};

const updateUser = async (nickname1, socketIdFront) => {
  const updatedUser = await connection()
    .then((db) => db.collection('users').findOneAndUpdate(
      { socketID: socketIdFront },
      { $set: { nickname: nickname1 } },
    ));
  return updatedUser.value;
};

const getAllUsers = async () => connection()
  .then((db) => db.collection('users').find().toArray());

const removeUser = async (socketID) => {
  await connection().then((db) => db.collection('users')
    .findOneAndDelete({ socketID }));
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  removeUser,
};