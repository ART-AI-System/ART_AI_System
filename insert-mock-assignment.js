const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@art-ai-system.rpdlfxc.mongodb.net/`;
const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  
  // Find the student
  const student = await db.collection('users').findOne({ studentCode: 'DE181818' });
  let studentId = student ? student._id : new ObjectId();

  // Create a mock session and class to reference if necessary
  const classId = new ObjectId();
  const sessionId = new ObjectId();
  
  const assignmentId = new ObjectId();
  
  await db.collection('assignments').insertOne({
    _id: assignmentId,
    sessionId: sessionId,
    title: 'Practical Exam 1',
    description: 'Submit your code for PE 1',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
    status: 'PUBLISHED'
  });
  
  // Also we need a grade item for this assignment so submissions can map to it if needed
  // Some systems have 1-1 assignment to gradeItem
  const gradeItemId = new ObjectId();
  await db.collection('grade_items').insertOne({
    _id: gradeItemId,
    name: 'PE 1 Grade',
    assignmentId: assignmentId,
    maxScore: 10
  });

  console.log('Assignment created with ID:', assignmentId.toString());
  
  await client.close();
}

run().catch(console.error);
