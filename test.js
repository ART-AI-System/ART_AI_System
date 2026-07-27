require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb'); 
async function run() {
  const dbUsername = process.env.DB_USERNAME || 'admin';
  const dbPassword = process.env.DB_PASSWORD || 'admin';
  const dbName = process.env.DB_NAME || 'art-ai-system-dev';
  const uri = `mongodb+srv://${encodeURIComponent(dbUsername)}:${encodeURIComponent(dbPassword)}@art-ai-system.rpdlfxc.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect(); 
  const db = client.db(dbName); 
  
  const subjects = await db.collection('subjects').find().toArray();
  const subjectId = subjects[0]._id;
  
  const newClass = {
    classCode: 'TEST_CLASS',
    semesterId: new ObjectId(),
    subjectId: subjectId,
    subjectSnapshot: {
      subjectId: subjectId,
      code: subjects[0].code,
      name: subjects[0].name
    },
    lecturer: {
      lecturerId: new ObjectId(),
      fullName: 'Test Lecturer',
      email: 'test@test.com'
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await db.collection('classes').insertOne(newClass);
  const classId = result.insertedId;
  
  const subject = await db.collection('subjects').findOne({ _id: subjectId });
  const slots = subject?.defaultSlots || 10;
  
  const sessions = [];
  const now = new Date();
  for (let i = 1; i <= slots; i++) {
    sessions.push({
      classId: classId,
      sessionNo: i,
      title: `Session ${i}`,
      description: '',
      startTime: now,
      endTime: now,
      createdAt: now,
      updatedAt: now
    });
  }
  
  if (sessions.length > 0) {
    await db.collection('sessions').insertMany(sessions);
  }
  
  const insertedSessions = await db.collection('sessions').find({ classId }).toArray();
  console.log('Inserted sessions:', insertedSessions.length);
  
  await client.close(); 
} 
run().catch(console.dir);
