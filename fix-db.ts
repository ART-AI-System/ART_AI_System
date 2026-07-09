import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@art-ai-system.rpdlfxc.mongodb.net/`
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(process.env.DB_NAME)
  
  // Fix the dummy session to have sessionNo = 1
  await db.collection('sessions').updateOne(
    { _id: new ObjectId('6a44a84261c6eb0a694e2d3a') },
    { $set: { sessionNo: 1 } }
  )

  // Wait, also update the previous grade item to map correctly for the student so they can see it
  const swd392 = new ObjectId('6a4f98f08710ef74b8c12c58')
  const session1InSWD392 = await db.collection('sessions').findOne({ classId: swd392, sessionNo: 1 })
  
  if (session1InSWD392) {
    await db.collection('grade_items').updateMany(
      { classId: swd392, title: 'PT1' }, // Or any grade item in SWD392 without sessionId
      { $set: { sessionId: session1InSWD392._id } }
    )
  }

  console.log("DB Fixed")
  client.close()
}
run()
