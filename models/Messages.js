const connection = require('./connection');

// Requisito-1
const create = async (date, nickname, chatMessage) => {
    const newMessage = await connection()
      .then((db) => db.collection('messages').insertOne({ date, nickname, chatMessage }));
    return (newMessage.ops[0]);
  };

// Requisito-3
const getAll = async () => {
  const dbMessages = await connection()
    .then((db) => db.collection('messages').find().toArray());
  return dbMessages;
};
  module.exports = {
    create,
    getAll,
  };  