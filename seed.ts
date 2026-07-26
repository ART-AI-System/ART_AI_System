import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/schemas/users.schema';
import Class from './src/models/schemas/classes.schema';
import Session from './src/models/schemas/sessions.schema';
import Assignment from './src/models/schemas/assignments.schema';
import { hashPassword } from './src/utils/crypto';

dotenv.config();

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/art-ai-system');
  console.log('Connected.');

  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Class.deleteMany({});
  await Session.deleteMany({});
  await Assignment.deleteMany({});

  console.log('Seeding Users...');
  const passwordHash = hashPassword('Password@123');
  
  const admin = await User.create({
    username: 'admin01',
    password: passwordHash,
    fullName: 'System Admin',
    role: 'ADMIN'
  });

  const lecturer = await User.create({
    username: 'lecturer01',
    password: passwordHash,
    fullName: 'Lecturer Alan Smith',
    role: 'LECTURER'
  });

  const student = await User.create({
    studentCode: 'DE181818',
    password: passwordHash,
    fullName: 'Student Nguyen Van A',
    role: 'STUDENT'
  });

  console.log('Seeding Class and Assignment...');
  const mockClass = await Class.create({
    courseCode: 'PRJ301',
    classCode: 'SE18D01',
    lecturerId: lecturer._id,
    studentIds: [student._id]
  });

  const mockSession = await Session.create({
    classId: mockClass._id,
    sessionNumber: 1,
    title: 'Intro to Web'
  });

  const mockAssignment = await Assignment.create({
    sessionId: mockSession._id,
    title: 'Practical Exam 1',
    description: 'Submit your code for PE 1',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
    status: 'PUBLISHED'
  });

  console.log('\n--- SEED COMPLETE ---');
  console.log(`Lecturer ID: ${lecturer._id}`);
  console.log(`Student ID: ${student._id}`);
  console.log(`Class ID: ${mockClass._id}`);
  console.log(`Assignment ID: ${mockAssignment._id}`);

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
