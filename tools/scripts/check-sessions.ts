import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@art-ai-system.rpdlfxc.mongodb.net/`
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(process.env.DB_NAME)
  
  const class1 = '6a44a84261c6eb0a694e2d36' // PRJ301
  const class2 = '6a4f98f08710ef74b8c12c58' // SWD392

  console.log("--- Sessions in PRJ301 ---")
  const s1 = await db.collection('sessions').find({ classId: new ObjectId(class1) }).toArray()
  console.log(s1.map(s => ({ id: s._id, title: s.title, no: s.sessionNo })))

  console.log("--- Sessions in SWD392 ---")
  const s2 = await db.collection('sessions').find({ classId: new ObjectId(class2) }).toArray()
  console.log(s2.map(s => ({ id: s._id, title: s.title, no: s.sessionNo })))

  console.log("--- GradeItems in SWD392 ---")
  const g2 = await db.collection('grade_items').find({ classId: new ObjectId(class2) }).toArray()
  console.log(g2.map(g => ({ id: g._id, title: g.title, sessionId: g.sessionId })))

  client.close()
}
run()
