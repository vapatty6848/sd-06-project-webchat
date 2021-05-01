// const { ObjectId } = require('mongodb');
const connection = require('./connection');

const collectionName = 'messages';

const getAll = async () => {
  connection().then((db) => db.collection(collectionName).find().toArray());
};

const create = async ({ chatMessage, nickname, timestamp }) => {
  connection().then((db) => db.collection(collectionName).insertOne({
    chatMessage,
    nickname,
    timestamp,
  }));
};

module.exports = {
  getAll,
  create,
};