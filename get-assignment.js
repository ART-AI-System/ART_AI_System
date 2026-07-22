const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@art-ai-system.rpdlfxc.mongodb.net/`;
const client = new MongoClient(uri);
client.connect().then(() => {
  const db = client.db(process.env.DB_NAME);
  db.collection('assignments').findOne().then(a => {
    if (a) {
      console.log('Found assignment:', a._id.toString());
    } else {
      console.log('No assignments found.');
    }
    client.close();
  });
}).catch(console.error);
