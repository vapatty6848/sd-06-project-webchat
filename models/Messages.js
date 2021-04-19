const { ObjectId } = require('mongodb');
const connection = require('./connection');

const COLLECTION_NAME = 'messages';

const getAll = async () => connection()
    .then((database) => database.collection(COLLECTION_NAME).find().toArray());

const create = async (message, nickname, timestamp) => {
  const { insertedId } = await connection()
    .then((db) => db.collection(COLLECTION_NAME).insertOne({ message, nickname, timestamp }));
    return {
    _id: insertedId,
  };
};

const removeById = async (id) => {
  await connection().then((db) => db.collection(COLLECTION_NAME).deleteOne(
    { _id: ObjectId(id) },
  ));
};

module.exports = {
  getAll,
  create,
  removeById,
};