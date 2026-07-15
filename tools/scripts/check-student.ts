import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function checkStudent() {
  const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME as string)}:${encodeURIComponent(process.env.DB_PASSWORD as string)}@art-ai-system.rpdlfxc.mongodb.net/`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('art_ai_db');

    // Get current semester
    const currentSemester = await db.collection('semesters').findOne({ isCurrent: true });
    console.log('Current Semester:', currentSemester?.code, currentSemester?._id);

    // Get student Nguyen Van Duc (based on screenshot)
    const student = await db.collection('users').findOne({ role: 'STUDENT', fullName: 'Nguyen Van Duc' });
    console.log('Student:', student?.fullName, student?._id);

    if (student) {
      // Get all classMembers for this student in current semester
      const classMembers = await db.collection('class_members').find({
        studentId: student._id,
        semesterId: currentSemester?._id
      }).toArray();
      
      console.log('Class Members found:', classMembers.length);
      
      for (const cm of classMembers) {
        const cls = await db.collection('classes').findOne({ _id: cm.classId });
        console.log(`- Enrolled in Class: ${cls?.classCode} (Subject: ${cls?.subjectSnapshot?.code}, Semester: ${cls?.semesterId})`);
      }
      
      // Check other semesters just in case
      const otherClassMembers = await db.collection('class_members').find({
        studentId: student._id,
        semesterId: { $ne: currentSemester?._id }
      }).toArray();
      
      console.log('Class Members in OTHER semesters:', otherClassMembers.length);
      for (const cm of otherClassMembers) {
        const cls = await db.collection('classes').findOne({ _id: cm.classId });
        console.log(`- Enrolled in Class: ${cls?.classCode} (Subject: ${cls?.subjectSnapshot?.code}, Semester: ${cls?.semesterId})`);
      }
    }
  } finally {
    await client.close();
  }
}

checkStudent().catch(console.error);
