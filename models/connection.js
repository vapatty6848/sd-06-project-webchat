const { MongoClient } = require('mongodb');
require('dotenv').config();

let schema = null;

async function connection() {
  if (schema) return Promise.resolve(schema);
  return MongoClient
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => conn.db(process.env.DB_NAME))
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



// module.exports = connection;
// const { MongoClient } = require('mongodb');
// const MONGODB_URL = 'mongodb://127.0.0.1:27017';
// const DATABASE = '';
// const connection = () => {
//   return MongoClient.connect(MONGODB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then((conn) => conn.db(DATABASE))
//   .catch((err) => {
//     process.exit();
//   });
// }