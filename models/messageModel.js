const connection = require('./connection');

const addMessages = async ({ chatMessage, nickname, messageFormat }) => connection()
  .then(async (db) => {
    const addMessage = 
    await db.collection('messages').insertOne({ chatMessage, nickname, messageFormat });
    // Aplicando o valor padrão as opções da função 
    return addMessage.ops[0];
  });

const allMessages = async () => connection()
  .then(async (db) => {
    const getAllMessages = await db.collection('messages').find().toArray();
    return getAllMessages;
  });

module.exports = {
  addMessages,
  allMessages,
};
