const connection = require('./connection');

const addMessages = async (data) => connection()
  .then(async (db) => {
  const newMessage = await db.collection('messages').insertOne(data);
  return newMessage.ops[0];
});

module.exports = {
  addMessages,
};
