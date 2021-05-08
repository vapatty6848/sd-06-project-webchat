const connection = require('./connection');

// Criar Mensagem
const createMessage = async ({ message, nickname, timestamp }) => {
  const newMessage = await connection()
    .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }));

  return newMessage;
};

// Listar todas as Mensagens
const getAllMessages = async () => {
  const allMessage = await connection()
    .then((db) => db.collection('messages').find({}).toArray());

  return allMessage;
};

module.exports = { 
  createMessage,
  getAllMessages,
};