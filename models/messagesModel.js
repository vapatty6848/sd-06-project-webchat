const connection = require('./connection');

const collection = 'messages';

const saveMessage = async ({ chatMessage, nickname, timestamp }) => {
  connection().then((db) => 
    db.collection(collection).insertOne({ chatMessage, nickname, timestamp }));
};

module.export = {
  saveMessage,
};
