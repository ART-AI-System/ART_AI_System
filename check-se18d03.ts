import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@art-ai-system.rpdlfxc.mongodb.net/`
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(process.env.DB_NAME)
  
  const classId = '6a4f979b101185fe5b3a75be' // SE18D03
  console.log("--- GradeItems in SE18D03 ---")
  const items = await db.collection('grade_items').find({ classId: new ObjectId(classId) }).toArray()
  console.log(items.map(g => ({ id: g._id, title: g.title, sessionId: g.sessionId })))

  console.log("--- Sessions in SE18D03 ---")
  const sessions = await db.collection('sessions').find({ classId: new ObjectId(classId) }).toArray()
  console.log(sessions.map(s => ({ id: s._id, title: s.title, no: s.sessionNo })))

  client.close()
}
run()
