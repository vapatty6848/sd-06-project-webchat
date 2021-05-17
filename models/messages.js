// const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAll = async () => {
  const allMessages = await connection()
    .then((db) => db.collection('messages').find().toArray());
  return allMessages;
};

const create = async (chatMessage, nickname, timestamp) => {
  const newMessage = await connection().then((db) => db.collection('messages').insertOne({
    chatMessage,
    nickname,
    timestamp,
  }));
  // console.log('My new message', newMessage.ops[0]);
  return newMessage.ops[0];
};

module.exports = {
  getAll,
  create,
};