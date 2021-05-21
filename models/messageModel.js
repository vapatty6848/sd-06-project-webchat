const connection = require('./connection');

const addMessages = async ({ chatMessage, nickname, date }) => connection()
  .then(async (db) => {
    const addMessage = await db.collection('messages').insertOne({ chatMessage, nickname, date });
    // Aplicando o valor padrão as opções da função 
    return addMessage.ops[0];
  });

module.exports = {
  addMessages,
};
