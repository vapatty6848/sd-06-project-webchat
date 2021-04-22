const connection = require('./connection');

const getAll = async () => {
  const allMessages = await connection()
    .then((db) => db.collection('messages')
      .find().toArray());

  return allMessages;
};

const create = async (data) => connection()
.then(async (db) => {
  const message = await db.collection('messages').insertOne(data);
  return message.ops[0];
});

module.exports = {
  getAll,
  create,
};