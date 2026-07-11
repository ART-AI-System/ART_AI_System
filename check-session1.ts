import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@art-ai-system.rpdlfxc.mongodb.net/`
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(process.env.DB_NAME)
  
  const classId = '6a44a84261c6eb0a694e2d36' // PRJ301 SE18D01
  const session = await db.collection('sessions').findOne({ 
    classId: new ObjectId(classId), 
    sessionNo: 1 
  })
  
  console.log("PRJ301 Session 1:", session)

  client.close()
}
run()
