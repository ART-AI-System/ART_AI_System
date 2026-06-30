const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config();

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function hashPassword(password) {
  return sha256(password + process.env.PASSWORD_SECRET);
}

async function seed() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/art-ai-system');
  await client.connect();
  const db = client.db();
  console.log('Connected.');

  console.log('Clearing existing data...');
  await db.collection('users').deleteMany({});
  await db.collection('classes').deleteMany({});
  await db.collection('sessions').deleteMany({});
  await db.collection('assignments').deleteMany({});

  console.log('Seeding Users...');
  const passwordHash = hashPassword('Password@123');
  
  const adminId = new ObjectId();
  await db.collection('users').insertOne({
    _id: adminId,
    username: 'admin01',
    passwordHash: passwordHash,
    fullName: 'System Admin',
    role: 'ADMIN',
    status: 'active',
    isActive: true,
    email: 'admin01@fpt.edu.vn'
  });

  const lecturerId = new ObjectId();
  await db.collection('users').insertOne({
    _id: lecturerId,
    username: 'lecturer01',
    passwordHash: passwordHash,
    fullName: 'Lecturer Alan Smith',
    role: 'LECTURER',
    status: 'active',
    isActive: true,
    email: 'lecturer01@fpt.edu.vn'
  });

  const studentId = new ObjectId();
  await db.collection('users').insertOne({
    _id: studentId,
    studentCode: 'DE181818',
    username: 'DE181818',
    passwordHash: passwordHash,
    fullName: 'Student Nguyen Van A',
    role: 'STUDENT',
    status: 'active',
    isActive: true,
    email: 'DE181818@fpt.edu.vn'
  });

  console.log('Seeding Class and Assignment...');
  const classId = new ObjectId();
  await db.collection('classes').insertOne({
    _id: classId,
    courseCode: 'PRJ301',
    classCode: 'SE18D01',
    lecturerId: lecturerId,
    studentIds: [studentId]
  });

  const sessionId = new ObjectId();
  await db.collection('sessions').insertOne({
    _id: sessionId,
    classId: classId,
    sessionNumber: 1,
    title: 'Intro to Web'
  });

  const assignmentId = new ObjectId();
  await db.collection('assignments').insertOne({
    _id: assignmentId,
    sessionId: sessionId,
    title: 'Practical Exam 1',
    description: 'Submit your code for PE 1',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
    status: 'PUBLISHED'
  });

  console.log('\n--- SEED COMPLETE ---');
  console.log(`Lecturer ID: ${lecturerId}`);
  console.log(`Student ID: ${studentId}`);
  console.log(`Class ID: ${classId}`);
  console.log(`Assignment ID: ${assignmentId}`);

  await client.close();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
