const connection = require('./connection');

const saveMessage = async ({ message, nickname, timestamps }) => connection()
    .then((db) => db.collection('messages').insertOne({ message, nickname, timestamps }));

const getAllMessages = async () => connection()
    .then((db) => db.collection('messages').find().toArray());

module.exports = { saveMessage, getAllMessages };
