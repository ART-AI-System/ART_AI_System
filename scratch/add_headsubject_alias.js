const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config();

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function hashPassword(password) {
  const secret = process.env.PASSWORD_SECRET || 'default_password_secret_key';
  return sha256(password + secret);
}

async function addAlias() {
  const uri = process.env.MONGODB_URI || 
    `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME || 'admin')}:${encodeURIComponent(process.env.DB_PASSWORD || 'admin')}@art-ai-system.rpdlfxc.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.DB_NAME || 'art-ai');
  
  const passwordHash = hashPassword('Password@123');
  const now = new Date();

  // Check if headsubject exists
  const existing = await db.collection('users').findOne({ username: 'headsubject' });
  if (!existing) {
    await db.collection('users').insertOne({
      _id: new ObjectId(),
      username: 'headsubject',
      passwordHash,
      fullName: 'Dr. Tran Minh Hoang',
      role: 'SUBJECT_HEAD',
      status: 'active',
      isActive: true,
      email: 'headsubject@fpt.edu.vn',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      createdAt: now
    });
    console.log('Successfully created user "headsubject"!');
  } else {
    await db.collection('users').updateOne(
      { username: 'headsubject' },
      { $set: { passwordHash, status: 'active', isActive: true } }
    );
    console.log('Successfully updated user "headsubject"!');
  }

  await client.close();
}

addAlias();
