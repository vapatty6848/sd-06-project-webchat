const connection = require('./connection');

const createMessage = async ({ nickname, chatMessage, timeMessage }) => connection()
  .then(async (db) => {
    const newMessage = await db
    .collection('messages')
    .insertOne({ nickname, chatMessage, timeMessage });
    return newMessage.ops[0];
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });

const getAllMessages = async () => connection()
  .then((db) => db.collection('messages').find().toArray())
  .catch((err) => {
    console.log(err);
    throw err;
  });

module.exports = {
  getAllMessages,
  createMessage,
};
