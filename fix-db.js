require('dotenv').config();
const { MongoClient } = require('mongodb'); 
async function run() {
  const dbUsername = process.env.DB_USERNAME || 'admin';
  const dbPassword = process.env.DB_PASSWORD || 'admin';
  const dbName = process.env.DB_NAME || 'art-ai-system-dev';
  const uri = `mongodb+srv://${encodeURIComponent(dbUsername)}:${encodeURIComponent(dbPassword)}@art-ai-system.rpdlfxc.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect(); 
  const db = client.db(dbName); 
  
  // 1. Rename sessionNumber to sessionNo
  await db.collection('sessions').updateMany(
    { sessionNumber: { $exists: true } },
    { $rename: { "sessionNumber": "sessionNo" } }
  );
  
  // 2. Generate missing sessions for all classes
  const classes = await db.collection('classes').find().toArray();
  for (const cls of classes) {
    const subject = await db.collection('subjects').findOne({ _id: cls.subjectId });
    const slots = subject?.defaultSlots || 10;
    
    const existingSessionsCount = await db.collection('sessions').countDocuments({ classId: cls._id });
    if (existingSessionsCount < slots) {
      const sessionsToInsert = [];
      const now = new Date();
      for (let i = existingSessionsCount + 1; i <= slots; i++) {
        sessionsToInsert.push({
          classId: cls._id,
          sessionNo: i,
          title: `Session ${i}`,
          description: '',
          startTime: now,
          endTime: now,
          createdAt: now,
          updatedAt: now
        });
      }
      if (sessionsToInsert.length > 0) {
        await db.collection('sessions').insertMany(sessionsToInsert);
      }
    }
  }

  // 3. Update submissions to 'graded' status if they have grades
  const grades = await db.collection('grades').find({}).toArray();
  for (const grade of grades) {
    if (grade.submissionId) {
      await db.collection('submissions').updateOne(
        { _id: grade.submissionId },
        { $set: { status: 'graded' } }
      );
    }
  }
  
  console.log('Database fixed successfully!');
  await client.close(); 
} 
run().catch(console.dir);
