import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@art-ai-system.rpdlfxc.mongodb.net/`
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(process.env.DB_NAME)
  
  console.log("--- Recent GradeItems ---")
  const items = await db.collection('grade_items').find().sort({_id:-1}).limit(3).toArray()
  console.log(items.map(g => ({ id: g._id, title: g.title, classId: g.classId, sessionId: g.sessionId })))

  console.log("--- Classes of these GradeItems ---")
  for (const item of items) {
     const cls = await db.collection('classes').findOne({ _id: item.classId })
     console.log(`Class ${item.classId}: Code=${cls?.classCode}`)
  }

  client.close()
}
run()
