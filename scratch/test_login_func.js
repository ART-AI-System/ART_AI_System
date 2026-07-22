const { MongoClient } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config();

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function hashPassword(password) {
  const secret = process.env.PASSWORD_SECRET || 'default_password_secret_key';
  return sha256(password + secret);
}

async function testFunc() {
  const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME || 'admin')}:${encodeURIComponent(process.env.DB_PASSWORD || 'admin')}@art-ai-system.rpdlfxc.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.DB_NAME || 'art-ai');
  
  const passwordHash = hashPassword('Password@123');
  const cleanUser = 'admin01';

  console.log('passwordHash:', passwordHash);

  const user = await db.collection('users').findOne({
    $and: [
      {
        $or: [
          { username: { $regex: new RegExp(`^${cleanUser}$`, 'i') } },
          { email: { $regex: new RegExp(`^${cleanUser}$`, 'i') } }
        ]
      },
      {
        $or: [
          { passwordHash },
          { password: passwordHash }
        ]
      }
    ]
  });

  console.log('Found user with findOne query:', user ? user.username : 'NULL');

  await client.close();
}

testFunc();
