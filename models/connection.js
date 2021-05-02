const { MongoClient } = require('mongodb');
require('dotenv').config();

let schema = null;
const DBURL = process.env.DB_URL || 'mongo';
const DBNAME = process.env.DB_NAME || 'mongodb://localhost:27017/webchat';

async function connection() {
  if (schema) return Promise.resolve(schema);
  return MongoClient
    .connect(DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => conn.db(DBNAME))
    .then((dbSchema) => {
      schema = dbSchema;
      return schema;
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = connection;
