const connection = require('./connection');

const colle = 'messages';

const createMessage = async (timestamp, nickname, message) => connection()
    .then((db) => db.collection(colle).insertOne({ timestamp, nickname, message }));

const getAll = async () => connection()
    .then((db) => db.collection(colle).find().toArray());

module.exports = {
  createMessage,
  getAll,
};
