import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@art-ai-system.rpdlfxc.mongodb.net/`
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(process.env.DB_NAME)
  
  await db.collection('grade_items').deleteMany({ title: 'PT 1 JAVA web' })

  console.log("Deleted old invalid grade items")
  client.close()
}
run()
