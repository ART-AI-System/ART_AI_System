import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../backend/.env') });

const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME as string)}:${encodeURIComponent(process.env.DB_PASSWORD as string)}@art-ai-system.rpdlfxc.mongodb.net/`;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const submissions = db.collection('submissions');
    
    const id = '6a570b2213e22029b8033d33';
    console.log('Searching for submission ID:', id);
    const sub = await submissions.findOne({ _id: new ObjectId(id) });
    console.log('Submission found:', JSON.stringify(sub, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();
