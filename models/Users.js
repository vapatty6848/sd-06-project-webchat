const connection = require('./connection');

const COLLECTION_NAME = 'users';

const getAll = async () => connection()
    .then((db) => db.collection(COLLECTION_NAME).find().toArray());

const create = async (id, nickname) => {
  const { insertedId } = await connection()
    .then((db) => db.collection(COLLECTION_NAME).insertOne({ id, nickname }));
  return {
    _id: insertedId,
  };
};

const update = async (id, nickname) => {
  const userUpdated = await connection()
    .then((db) => db.collection(COLLECTION_NAME).findOneAndUpdate(
        { id },
        { $set: { nickname } },
        { returnOriginal: false },
    ));

  return userUpdated.value;
};

const getById = async (id) => {
 await connection().then((db) => db.collection(COLLECTION_NAME).findOne({ id }));
};

const removeById = async (id) => {
  await connection().then((db) => db.collection(COLLECTION_NAME).findOneAndDelete({ id }));
};

module.exports = {
  getAll,
  create,
  getById,
  update,
  removeById,
};