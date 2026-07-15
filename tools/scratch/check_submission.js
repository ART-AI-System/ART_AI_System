const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../backend/.env') });

const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@art-ai-system.rpdlfxc.mongodb.net/`;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const submissions = db.collection('submissions');
    
    const allSubs = await submissions.find({}).toArray();
    console.log(`Found ${allSubs.length} submissions in DB:`);
    for (const sub of allSubs) {
      console.log(`- ID: ${sub._id}, fileName: ${sub.fileName}, fileStorageKey: ${sub.fileStorageKey}, fileUrl: ${sub.fileUrl}`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();
