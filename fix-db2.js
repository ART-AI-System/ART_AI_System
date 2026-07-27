const { MongoClient } = require('mongodb'); 
async function run() { 
  const client = new MongoClient('mongodb+srv://admin:admin@art-ai-system.rpdlfxc.mongodb.net/'); 
  await client.connect(); 
  const db = client.db('art-ai-system-dev'); 
  const items = await db.collection('grade_items').find({ type: 'test' }).sort({ createdAt: -1 }).limit(1).toArray(); 
  if (items.length > 0) {
    const testId = items[0]._id; 
    await db.collection('grade_items').updateOne({ _id: testId }, { $set: { isRandomPerStudent: true, randomCount: 5 }}); 
    console.log('Updated test ' + testId); 
  }
  await client.close(); 
} 
run();
