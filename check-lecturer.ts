import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function checkLecturer() {
  const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME as string)}:${encodeURIComponent(process.env.DB_PASSWORD as string)}@art-ai-system.rpdlfxc.mongodb.net/`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    // Get current semester
    const currentSemester = await db.collection('semesters').findOne({ isCurrent: true, isActive: true });
    console.log('Current Semester:', currentSemester?.code, currentSemester?._id);

    // Get lecturer
    const lecturer = await db.collection('users').findOne({ role: 'LECTURER' });
    console.log('Lecturer:', lecturer?.fullName, lecturer?._id);

    // Get classes for this lecturer in current semester
    const classes = await db.collection('classes').find({ lecturerId: lecturer?._id }).toArray();
    console.log('Classes assigned to lecturer:', JSON.stringify(classes, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

checkLecturer();
