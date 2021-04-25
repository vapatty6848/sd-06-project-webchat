const connection = require('./connection');

const createMessages = async (nickname, message, timestamp) => {
  const { insertedId } = await connection()
    .then((db) => db.collection('messages').insertOne({ nickname, message, timestamp }));
  return {
    _id: insertedId,
    nickname,
    message,
    timestamp,
  };
};

const getAllMessages = async () => connection()
  .then((database) => database.collection('messages').find().toArray());

module.exports = {
  createMessages,
  getAllMessages,
};

// iniciando o projeto