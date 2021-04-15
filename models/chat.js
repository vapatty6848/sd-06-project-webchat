const connection = require('./connection');

const getAllMessages = async () => connection()
  .then((db) => db.collection('messages').find().toArray())
  .catch((err) => {
    console.log(err);
    throw err;
  });

const createMessage = async (data) => connection()
  .then(async (db) => {
    const newMessage = await db.collection('messages').insertOne(data);
    return newMessage.ops[0];
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });

module.exports = {
  getAllMessages,
  createMessage,
};
