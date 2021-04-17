const connection = require('./connection');

const messages = 'messages';

const usersGetAll = async () => {
  const allUsers = await connection().then((db) => db.collection(messages).find().toArray());

  return allUsers;
};

const removeById = async (id) => {
  const userDelet = await connection().then((db) => db.collection(messages)
  .findOneAndDelete({ id }));
  return userDelet;
};

module.exports = { usersGetAll, removeById }; 