const mongoose = require('mongoose');

// const dbUrl = process.env.DB_URL;

const connection = mongoose.connect('mongodb://localhost:27017/webchat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Db Connected');
});

module.exports = connection;

// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// let schema = null;

// async function connection() {
//   if (schema) return Promise.resolve(schema);
//   return MongoClient
//     .connect(process.env.DB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then((conn) => conn.db(process.env.DB_NAME))
//     .then((dbSchema) => {
//       schema = dbSchema;
//       return schema;
//     })
//     .catch((err) => {
//       console.error(err);
//       process.exit(1);
//     });
// }

// module.exports = connection;
