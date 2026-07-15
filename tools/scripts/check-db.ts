import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.eebwrtq.mongodb.net/?retryWrites=true&w=majority`
  console.log("Connecting to", process.env.DB_NAME)
  // The backend uses database.service.ts which uses process.env.DB_USERNAME and DB_PASSWORD.
  // Wait, let's just use the exact connection logic from database.service.ts.
  const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@art-ai-cluster.xxxx.mongodb.net/?retryWrites=true&w=majority`
  // Actually, wait, let me just check how database.service.ts connects.
}
run()
