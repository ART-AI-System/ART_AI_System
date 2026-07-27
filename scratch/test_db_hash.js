const { MongoClient } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config();

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function run() {
  const uri = process.env.MONGODB_URI || 
    `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME || 'admin')}:${encodeURIComponent(process.env.DB_PASSWORD || 'admin')}@art-ai-system.rpdlfxc.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.DB_NAME || 'art-ai');
  const user = await db.collection('users').findOne({ username: 'admin01' });
  console.log('=== ADMIN USER IN DB ===');
  console.log(user);
  
  const secretInEnv = process.env.PASSWORD_SECRET || 'default_password_secret_key';
  console.log('PASSWORD_SECRET in .env:', process.env.PASSWORD_SECRET);
  console.log('Hash with secret in env:', sha256('Password@123' + secretInEnv));
  console.log('Hash with @ART_AI_System@:', sha256('Password@123' + '@ART_AI_System@'));

  await client.close();
}

run();
