const connection = require('./connection');

async function createMessage(message, nickname, dateTime) {
  const db = await connection();
  const newMessage = await db.collection('messages').insertOne({ message, nickname, dateTime });

  return newMessage.ops[0];
}

async function getAllMessages() {
  const db = await connection();
  const allMessages = db.collection('messages').find().toArray();

  return allMessages;
}

module.exports = {
  createMessage,
  getAllMessages,
};
