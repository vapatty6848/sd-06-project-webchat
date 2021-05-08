const connection = require('./models/connection');

const collection = 'messages';

// const find = () => connection()
//   .then((db) => db.collection(collection))
//   .then((table) => table.find({ messages:
//     { $exists: true, $type: 'array', $ne: [] },
//   }).toArray());

const find = () => connection()
  .then((db) => db.collection(collection))
  .then((table) => table.find({}).toArray());

const create = (message, nickname, timestamp) => connection()
  .then((db) => db.collection(collection))
  .then((table) => table.insertOne({ message, nickname, timestamp }));

module.exports = {
  find,
  create,
};