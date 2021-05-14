const connection = require('./connection');

const collection = 'messages';

const saveMessage = async (message, nickname, timestamp) => {
  await connection().then((db) => 
    db.collection(collection).insertOne({ message, nickname, timestamp }));
};

const getMessages = async () => {
  const messages = await connection().then((db) => db.collection(collection)
    .find().toArray());

  return messages;
};

// const getUsers = async () => {
//   const users = await connection().then((db) => db.collection('users')
//     .find().toArray());
//   return users;
// };

// const saveUser = async (nickname) => {
//   await connection().then((db) => 
//     db.collection('users').insertOne({ nickname }));
// };

// const deleteUser = async (nickname) => {
//   await connection().then((db) => 
//     db.collection('users').deleteOne({ nickname }));
// };

// const updateUser = async (oldNickname, newNickname) => {
//   await connection().then((db) => 
//     db.collection('users').updateOne(
//       { nickname: oldNickname },
//       { $set: { nickname: newNickname } },
//     ));
// };

module.exports = {
  saveMessage,
  getMessages,
};