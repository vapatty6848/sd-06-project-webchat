const connection = require('./connection');

const create = async (dataUser) => {  
  await connection().then((db) => db.collection('messages').insertOne(dataUser));
  return dataUser;
};

const findAll = async () => connection().then((db) => db.collection('messages')
.find().toArray());

module.exports = { 
  create,
  findAll,
};
