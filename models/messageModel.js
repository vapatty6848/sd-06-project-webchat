const connection = require('./connection');

const create = async (nickname, message, timestamp) => {
  const newMessage = await connection()
    .then((db) => db.collection('messages').insertOne({
      nickname,
      message,
      timestamp,
    }));

  return newMessage.ops[0];
};

const getAll = async () => {
  const allMessages = await connection()
    .then((db) => db.collection('messages').find().toArray());
  
  return allMessages;
};

module.exports = {
  create,
  getAll,
};
