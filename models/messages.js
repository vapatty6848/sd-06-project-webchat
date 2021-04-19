const connection = require('./connection');

const createMessage = async (data) => connection()
  .then(async (db) => {
  const newMessage = await db.collection('messages').insertOne(data);
  return newMessage.ops[0];
});

const getAll = async () => {
  const allMsgs = await connection().then((db) => db.collection('messages').find().toArray());
  return allMsgs;
};

module.exports = {
  createMessage,
  getAll,
};
