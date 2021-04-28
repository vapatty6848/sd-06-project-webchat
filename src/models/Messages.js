const connection = require('./connection');

const createMessage = async (data) => connection()
.then(async (db) => {
  const message = await db.collection('messages').insertOne(data);
  return message.ops[0];
});

const getAll = async () => {
  const messages = await connection().then((db) => db.collection('messages').find().toArray());
  return messages;
};

module.exports = {
  createMessage,
  getAll,
};