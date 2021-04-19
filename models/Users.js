const connection = require('./connection');

const getAll = async () => {
  const result = await connection()
    .then((db) => db.collection('Users').find().toArray());
  return result;
};

const create = async (id, nickname) => {
  const result = await connection()
    .then((db) => db.collection('Users').insertOne({ id, nickname }));
  return result.ops[0];
};

const update = async ({ id, nickname }) => {
  const result = await connection()
    .then((db) => db.collection('Users').findOneAndUpdate(
        { id },
        { $set: { nickname } },
        { returnOriginal: false },
      ));
  return result.value;
};

const findById = async (id) => {
  const result = await connection()
    .then((db) => db.collection('Users').findOne({ id }));
  return result;
};

const removeById = async (id) => {
  const result = await connection()
    .then((db) => db.collection('Users').findOneAndDelete({ id }));
  return result;
};

module.exports = {
  getAll,
  create,
  update,
  findById,
  removeById,
};
