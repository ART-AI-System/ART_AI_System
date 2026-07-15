import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@art-ai-system.rpdlfxc.mongodb.net/`
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(process.env.DB_NAME)
  
  const id = '6a4f97c1101185fe5b3a75bf'
  const cls = await db.collection('classes').findOne({ _id: new ObjectId(id) })
  console.log("Class:", cls)

  if (cls) {
    const subject = await db.collection('subjects').findOne({ _id: new ObjectId(cls.subjectId) })
    console.log("Subject:", subject)
  }

  client.close()
}
run()
