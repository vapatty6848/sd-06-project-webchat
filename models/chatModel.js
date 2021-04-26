// const { ObjectId } = require('mongodb');

const moment = require('moment');
const connection = require('./connection');

const getAllMessages = async () => {
  console.log('MODEL - getAllMessages');
  const allMessages = await connection()
    .then((db) => db.collection('messages').find().toArray());
  return allMessages;
};

// aqui o Luciano me deu a dica de como já formatar as mensagens
// e já enviar elas prontas com o uso do format
const createMessage = async (objMessage) => {
  const { chatMessage: message, nickname } = objMessage;
  const data = new Date();
  const newDate = moment(data).format('DD-MM-yyyy hh:mm:ss');
  const newMessage = {
    message, nickname, timestamp: newDate,
  };
  await connection()
    .then((db) => db.collection('messages').insertOne(newMessage))
    .catch((err) => err);
  const stringMessage = `${newDate} - ${nickname}: ${message}`;
  return stringMessage;
};

const updateNick = async (nickname, newNickname) => {
  await connection()
    .then((db) => db.collection('messages').updateOne({ nickname }, {
      $set: { nickname: newNickname },
    }));
};

module.exports = {
  getAllMessages,
  createMessage,
  updateNick,
};
