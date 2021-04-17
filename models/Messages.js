const connection = require('./connection');
// const { ObjectId } = require('mongodb');
const collectionName = 'messages';

const createMessage = async (message, nickname, timestamp) => {
  const { insertedId } = await connection()
    .then((db) => db.collection(collectionName).insertOne({
      message, nickname, timestamp,
    }));
  return insertedId;
};

const getMessageByNickname = async (nickname) => {
  const menssageResponse = await connection()
    .then((db) => db.collection(collectionName).find({
      nickname,
    }).toArray());
  return menssageResponse;
};

const getAllMessages = async () => {
  const messagesResponse = await connection()
    .then((db) => db.collection(collectionName).find().toArray());
  return messagesResponse;
};

// const deleteById = async (id) => {

//   const product = await connection()
//     .then((db) => db.collection(collectionName).findOne(ObjectId(id)));

//   if(!product) return false;

//   await connection()
//     .then((db) => db.collection(collectionName).deleteOne({
//       _id: ObjectId(id)
//     }));

//   return product;
// };

module.exports = {
  createMessage,
  getMessageByNickname,
  getAllMessages,
  // deleteById,
};
