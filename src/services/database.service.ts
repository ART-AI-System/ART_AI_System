import { MongoClient, Db, Collection } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/users.schema'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import Class from '~/models/schemas/classes.schema'
import GradeItem from '~/models/schemas/gradeItems.schema'
import Grade from '~/models/schemas/grades.schema'
import FinalResult from '~/models/schemas/finalResults.schema'
dotenv.config()

const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME as string)}:${encodeURIComponent(process.env.DB_PASSWORD as string)}@art-ai-system.rpdlfxc.mongodb.net/`

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
      // ART_AI_DB_SCHEMA_SPEC: studentCode must be unique when present (sparse)
      const studentCodeIndexExists = await this.users.indexExists(['studentCode_1'])
      if (!studentCodeIndexExists) {
        await this.users.createIndex({ studentCode: 1 }, { unique: true, sparse: true })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.users.createIndex({ email: 1, password: 1 })
        await this.users.createIndex({ email: 1 }, { unique: true })
        await this.users.createIndex({ studentCode: 1 }, { unique: true, sparse: true })
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

  async initCollections() {
    try {
      const collections = await this.db.listCollections().toArray()
      const collectionNames = collections.map((c) => c.name)

      const requiredCollections = [
        process.env.DB_USERS_COLLECTION || 'users',
        process.env.DB_REFRESH_TOKENS_COLLECTION || 'refresh_tokens',
        process.env.DB_CLASSES_COLLECTION || 'classes',
        process.env.DB_GRADE_ITEMS_COLLECTION || 'grade_items',
        process.env.DB_GRADES_COLLECTION || 'grades',
        process.env.DB_FINAL_RESULTS_COLLECTION || 'final_results',
        process.env.DB_SUBMISSIONS_COLLECTION || 'submissions',
        process.env.DB_AI_INTERACTIONS_COLLECTION || 'ai_interactions',
        process.env.DB_AI_EVALUATIONS_COLLECTION || 'ai_evaluations',
        process.env.DB_SUBMISSION_FLAGS_COLLECTION || 'submission_flags',
        process.env.DB_SUBMISSION_REVIEWS_COLLECTION || 'submission_reviews',
        process.env.DB_NOTIFICATIONS_COLLECTION || 'notifications'
      ]

      for (const colName of requiredCollections) {
        if (!collectionNames.includes(colName)) {
          await this.db.createCollection(colName)
          console.log(`Created MongoDB collection: ${colName}`)
        }
      }
    } catch (error) {
      console.error('Error initializing MongoDB collections:', error)
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION || 'users')
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION || 'refresh_tokens')
  }

  get classes(): Collection<Class> {
    return this.db.collection(process.env.DB_CLASSES_COLLECTION || 'classes')
  }

  get gradeItems(): Collection<GradeItem> {
    return this.db.collection(process.env.DB_GRADE_ITEMS_COLLECTION || 'grade_items')
  }

  get grades(): Collection<Grade> {
    return this.db.collection(process.env.DB_GRADES_COLLECTION || 'grades')
  }

  get finalResults(): Collection<FinalResult> {
    return this.db.collection(process.env.DB_FINAL_RESULTS_COLLECTION || 'final_results')
  }

  get submissions(): Collection<any> {
    return this.db.collection(process.env.DB_SUBMISSIONS_COLLECTION || 'submissions')
  }

  get aiInteractions(): Collection<any> {
    return this.db.collection(process.env.DB_AI_INTERACTIONS_COLLECTION || 'ai_interactions')
  }

  get aiEvaluations(): Collection<any> {
    return this.db.collection(process.env.DB_AI_EVALUATIONS_COLLECTION || 'ai_evaluations')
  }

  get submissionFlags(): Collection<any> {
    return this.db.collection(process.env.DB_SUBMISSION_FLAGS_COLLECTION || 'submission_flags')
  }

  get submissionReviews(): Collection<any> {
    return this.db.collection(process.env.DB_SUBMISSION_REVIEWS_COLLECTION || 'submission_reviews')
  }

  get notifications(): Collection<any> {
    return this.db.collection(process.env.DB_NOTIFICATIONS_COLLECTION || 'notifications')
  }
}

// run().catch(console.dir)
const databaseService = new DatabaseService()

export default databaseService
