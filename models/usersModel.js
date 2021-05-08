const connection = require('./connection');

// Criar Mensagem
const createUser = async ({ id, nickname }) => {
  const newUser = await connection()
    .then((db) => db.collection('users').insertOne({ id, nickname }));

  return newUser;
};
// Listar todas as Mensagens
const getAllUsers = async () => {
  const allUsers = await connection()
    .then((db) => db.collection('users').find({}).toArray());

  return allUsers;
};

module.exports = {
  createUser,
  getAllUsers,
};