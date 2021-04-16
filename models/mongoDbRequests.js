const { ObjectID } = require('mongodb');

const connection = require('./connection');

const getAll = (collection) => connection()
  .then((db) => db.collection(collection).find().toArray());

const findById = (collection, id) => connection()
  .then((db) => db.collection(collection).findOne(ObjectID(id)));

const findByEmail = (collection, email) => connection()
  .then((db) => db.collection(collection).findOne({ email }));

const findByEmailAndPassword = (collection, email, password) => connection()
  .then((db) => db.collection(collection).findOne({ email, password }));

const findByIdAndIdUser = (collection, idRecipe, userId) => connection()
  .then((db) => db.collection(collection).findOne({ 
    _id: ObjectID(idRecipe),
    userId: { $eq: userId },
}));

const uploadDB = (collection, product) => connection()
  .then((db) => db.collection(collection).insertOne(product));

const nameExists = (collection, name) => connection()
  .then((db) => db.collection(collection)
    .find({ name }, { _id: 1 }).toArray());

const updateForId = (collection, id, objUpdate) => connection()
  .then((db) => db.collection(collection)
    .updateOne({ _id: ObjectID(id) }, { $set: objUpdate }));

const deleteForId = (collection, id) => connection()
  .then((db) => db.collection(collection).deleteOne({ _id: ObjectID(id) }));

const deleteForIdSocket = (collection, idSocket) => connection()
  .then((db) => db.collection(collection).deleteOne({ idSocket }));

module.exports = {
  getAll,
  findById,
  uploadDB,
  nameExists,
  updateForId,
  deleteForId,
  findByEmail,
  findByEmailAndPassword,
  findByIdAndIdUser,
  deleteForIdSocket,
};
