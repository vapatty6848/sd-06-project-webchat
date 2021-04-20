const connection = require('./connection');

const registerUser = async (id, nickname) => {
  const insertedUser = await connection().then((db) => {
    db.collection('users').insertOne({ id, nickname });
  });
  console.log('usuário inserido', insertedUser);
  return insertedUser;
};

const getUsers = async () => connection().then((db) => db
  .collection('users').find().toArray());

const updateUser = async (socketId, newNickname) => {
  const updatedUser = await connection().then((db) => db
  .collection('users').updateOne(
    { id: socketId },
    { $set: { nickname: newNickname } },
  ));
  return updatedUser;
};

const deleteDisconnectedUser = async (socketId) => connection().then((db) => db
  .collection('users').deleteOne({ id: socketId }));

module.exports = {
  registerUser,
  getUsers,
  updateUser,
  deleteDisconnectedUser,
};
