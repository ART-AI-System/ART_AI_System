import { MongoClient, Db, Collection } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/users.schema'
import RefreshToken from '~/models/schemas/refreshToken.schema'
dotenv.config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@art-ai-system.rpdlfxc.mongodb.net/`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      // Ensures that the client will close when you finish/error
      console.log('Failed to connect to MongoDB', error)
    }
  }

  async indexUsers() {
    try {
      const exists = await this.users.indexExists(['email_1', 'email_1_password_1'])
      if (!exists) {
        await this.users.createIndex({ email: 1, password: 1 })
        await this.users.createIndex({ email: 1 }, { unique: true })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.users.createIndex({ email: 1, password: 1 })
        await this.users.createIndex({ email: 1 }, { unique: true })
      } else {
        console.error('Error indexing users:', error)
      }
    }
  }

  async indexRefreshTokens() {
    try {
      const exists = await this.refreshTokens.indexExists(['token_1', 'exp_1'])
      if (!exists) {
        await this.refreshTokens.createIndex({ token: 1 }, { unique: true })
        await this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.refreshTokens.createIndex({ token: 1 }, { unique: true })
        await this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
      } else {
        console.error('Error indexing refresh tokens:', error)
      }
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
}

// run().catch(console.dir)
const databaseService = new DatabaseService()

export default databaseService
