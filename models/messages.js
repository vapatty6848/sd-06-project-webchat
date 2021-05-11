const dateformat = require('dateformat');
const connection = require('./connection');

const COLLECTION_NAME = 'messages';

// const insertMessage = async (message, nickname) => {
const getAll = async () => {
  const allMessages = await connection()
    .then((db) => db.collection(COLLECTION_NAME)
    .find().toArray());
  return allMessages;
};

const insertMessage = async (message, nickname) => {
  const timestamp = dateformat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
  await connection()
    .then((db) => db.collection(COLLECTION_NAME)
    .insertOne({ message, nickname, timestamp }));
};

module.exports = {
  insertMessage,
  getAll,
};
