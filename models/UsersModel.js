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
  console.log(nickname1, socketIdFront, 'mooodeeeelllll');
  const userUpdated = await connection()
    .then((db) => db.collection('users').findOneAndUpdate(
      { socketID: socketIdFront },
      { $set: { nickname: nickname1 } },
      // { returnOriginal: false },
    ));
  return userUpdated.value;
};

const getAllUsers = async () => connection()
  .then((db) => db.collection('users').find().toArray());

const removeUser = async (socketID) => {
  // console.log(socketID, 'modeeeellll');
  await connection().then((db) => db.collection('users')
    .findOneAndDelete({ socketID }));
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  removeUser,
}; 