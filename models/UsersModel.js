// const connection = require('./connection');

let usersDb = [];

const registerUser = async (id, nickname) => {
  usersDb.push({ id, nickname });
/*   const insertedUser = await connection().then((db) => {
    db.collection('users').insertOne({ id, nickname });
  }); */
  return { id, nickname };
};

const getUsers = async () => usersDb; // connection().then((db) => db
  // .collection('users').find().toArray());

const updateUser = async (socketId, newNickname) => {
  usersDb = usersDb.map((user) => {
    if (user.id === socketId) {
      return { id: socketId, nickname: newNickname };
    }
    return user;
  });
  return { id: socketId, nickname: newNickname };
  /* const updatedUser = await connection().then((db) => db
  .collection('users').updateOne(
    { id: socketId },
    { $set: { nickname: newNickname } },
  ));
  return updatedUser; */
};

const deleteDisconnectedUser = async (socketId) => {
  usersDb = usersDb.filter((user) => user.id !== socketId);
};
// connection().then((db) => db
  // .collection('users').deleteOne({ id: socketId }));

module.exports = {
  registerUser,
  getUsers,
  updateUser,
  deleteDisconnectedUser,
};
