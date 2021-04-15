const connection = require('./connection');

const create = async (nickname, message) => {
  const newMessage = await connection()
    .then((db) => db.collection('messages').insertOne({
      nickname,
      message,
      timestamp: new Date().toLocaleString(),
    }));

  return newMessage;
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