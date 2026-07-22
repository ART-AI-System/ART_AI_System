const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGODB_URI || 
    `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME || 'admin')}:${encodeURIComponent(process.env.DB_PASSWORD || 'admin')}@art-ai-system.rpdlfxc.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.DB_NAME || 'art-ai');
  const heads = await db.collection('users').find({ role: 'SUBJECT_HEAD' }).toArray();
  console.log('=== SUBJECT HEAD USERS IN DB ===');
  console.log(heads);
  await client.close();
}

run();
