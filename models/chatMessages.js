const connection = require('./connection');

const getAllMessages = async () => connection()
  .then((db) => db.collection('messages').find().toArray())
  .catch((err) => {
    console.log(err);
    throw err;
  });

module.exports = {
  getAllMessages,
};