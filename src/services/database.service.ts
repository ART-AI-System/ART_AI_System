import { MongoClient, Db, Collection } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/users.schema'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import PasswordResetToken from '~/models/schemas/passwordResetToken.schema'
import Class from '~/models/schemas/classes.schema'
import GradeItem from '~/models/schemas/gradeItems.schema'
import Grade from '~/models/schemas/grades.schema'
import FinalResult from '~/models/schemas/finalResults.schema'
import Submission from '~/models/schemas/submissions.schema'
import SubmissionReview from '~/models/schemas/submissionReviews.schema'
import ChatRoom from '~/models/schemas/chatRoom.schema'
import ChatMessage from '~/models/schemas/chatMessage.schema'
import AiInteraction from '~/models/schemas/aiInteractions.schema'
import AiEvaluation from '~/models/schemas/aiEvaluations.schema'
import SubmissionFlag from '~/models/schemas/submissionFlags.schema'
import Semester from '~/models/schemas/semesters.schema'
import Subject from '~/models/schemas/subjects.schema'
import { Test } from '~/models/schemas/tests.schema'
import { TestAttempt } from '~/models/schemas/testAttempts.schema'
import Assignment from '~/models/schemas/assignments.schema'
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
      const emailIndexExists = await this.users.indexExists(['email_1'])
      if (!emailIndexExists) {
        await this.users.createIndex({ email: 1 }, { unique: true })
      }
      // ART_AI_DB_SCHEMA_SPEC: studentCode must be unique when present (sparse)
      const studentCodeIndexExists = await this.users.indexExists(['studentCode_1'])
      if (!studentCodeIndexExists) {
        await this.users.createIndex({ studentCode: 1 }, { unique: true, sparse: true })
      }
      // username unique sparse (staff accounts)
      const usernameIndexExists = await this.users.indexExists(['username_1'])
      if (!usernameIndexExists) {
        await this.users.createIndex({ username: 1 }, { unique: true, sparse: true })
      }
      // role and status indexes for filtering
      const roleIndexExists = await this.users.indexExists(['role_1'])
      if (!roleIndexExists) {
        await this.users.createIndex({ role: 1 })
        await this.users.createIndex({ status: 1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.users.createIndex({ email: 1 }, { unique: true })
        await this.users.createIndex({ studentCode: 1 }, { unique: true, sparse: true })
        await this.users.createIndex({ username: 1 }, { unique: true, sparse: true })
        await this.users.createIndex({ role: 1 })
        await this.users.createIndex({ status: 1 })
      } else {
        console.error('Error indexing users:', error)
      }
    }
  }

  async indexRefreshTokens() {
    try {
      const tokenHashIndexExists = await this.refreshTokens.indexExists(['tokenHash_1'])
      if (!tokenHashIndexExists) {
        await this.refreshTokens.createIndex({ tokenHash: 1 }, { unique: true })
      }
      const expiresAtIndexExists = await this.refreshTokens.indexExists(['expiresAt_1'])
      if (!expiresAtIndexExists) {
        // TTL index: MongoDB tự xóa document khi expiresAt < now
        await this.refreshTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
      }
      const userIdIndexExists = await this.refreshTokens.indexExists(['userId_1'])
      if (!userIdIndexExists) {
        await this.refreshTokens.createIndex({ userId: 1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.refreshTokens.createIndex({ tokenHash: 1 }, { unique: true })
        await this.refreshTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
        await this.refreshTokens.createIndex({ userId: 1 })
      } else {
        console.error('Error indexing refresh tokens:', error)
      }
    }
  }

  async indexPasswordResetTokens() {
    try {
      const tokenHashIndexExists = await this.passwordResetTokens.indexExists(['tokenHash_1'])
      if (!tokenHashIndexExists) {
        await this.passwordResetTokens.createIndex({ tokenHash: 1 }, { unique: true })
      }
      const expiresAtIndexExists = await this.passwordResetTokens.indexExists(['expiresAt_1'])
      if (!expiresAtIndexExists) {
        // TTL index: tự động xóa token hết hạn
        await this.passwordResetTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
      }
      const userIdIndexExists = await this.passwordResetTokens.indexExists(['userId_1'])
      if (!userIdIndexExists) {
        await this.passwordResetTokens.createIndex({ userId: 1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.passwordResetTokens.createIndex({ tokenHash: 1 }, { unique: true })
        await this.passwordResetTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
        await this.passwordResetTokens.createIndex({ userId: 1 })
      } else {
        console.error('Error indexing password reset tokens:', error)
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
        process.env.DB_PASSWORD_RESET_TOKENS_COLLECTION || 'password_reset_tokens',
        process.env.DB_CLASSES_COLLECTION || 'classes',
        process.env.DB_GRADE_ITEMS_COLLECTION || 'grade_items',
        process.env.DB_GRADES_COLLECTION || 'grades',
        process.env.DB_FINAL_RESULTS_COLLECTION || 'final_results',
        process.env.DB_SUBMISSIONS_COLLECTION || 'submissions',
        process.env.DB_AI_INTERACTIONS_COLLECTION || 'ai_interactions',
        process.env.DB_AI_EVALUATIONS_COLLECTION || 'ai_evaluations',
        process.env.DB_SUBMISSION_FLAGS_COLLECTION || 'submission_flags',
        process.env.DB_SUBMISSION_REVIEWS_COLLECTION || 'submission_reviews',
        process.env.DB_NOTIFICATIONS_COLLECTION || 'notifications',
        process.env.DB_EMAIL_LOGS_COLLECTION || 'email_logs',
        process.env.DB_ASSIGNMENTS_COLLECTION || 'assignments',
        process.env.DB_ASSIGNMENT_MATERIALS_COLLECTION || 'assignment_materials',
        process.env.DB_CHAT_ROOMS_COLLECTION || 'chat_rooms',
        process.env.DB_CHAT_MESSAGES_COLLECTION || 'chat_messages'
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

  async indexSubmissions() {
    try {
      const uuidIndexExists = await this.submissions.indexExists(['uuid_1'])
      if (!uuidIndexExists) {
        await this.submissions.createIndex({ uuid: 1 }, { unique: true })
      }

      const latestIndexExists = await this.submissions.indexExists(['studentId_1_gradeItemId_1_isLatest_1'])
      if (!latestIndexExists) {
        await this.submissions.createIndex({ studentId: 1, gradeItemId: 1, isLatest: 1 })
      }

      const classGradeItemIndexExists = await this.submissions.indexExists(['classId_1_gradeItemId_1'])
      if (!classGradeItemIndexExists) {
        await this.submissions.createIndex({ classId: 1, gradeItemId: 1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.submissions.createIndex({ uuid: 1 }, { unique: true })
        await this.submissions.createIndex({ studentId: 1, gradeItemId: 1, isLatest: 1 })
        await this.submissions.createIndex({ classId: 1, gradeItemId: 1 })
      } else {
        console.error('Error indexing submissions:', error)
      }
    }
  }

  async indexSubmissionReviews() {
    try {
      const submissionIndexExists = await this.submissionReviews.indexExists(['submissionId_1_lecturerId_1'])
      if (!submissionIndexExists) {
        await this.submissionReviews.createIndex({ submissionId: 1, lecturerId: 1 }, { unique: true })
      }

      const lecturerIndexExists = await this.submissionReviews.indexExists(['lecturerId_1'])
      if (!lecturerIndexExists) {
        await this.submissionReviews.createIndex({ lecturerId: 1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.submissionReviews.createIndex({ submissionId: 1, lecturerId: 1 }, { unique: true })
        await this.submissionReviews.createIndex({ lecturerId: 1 })
      } else {
        console.error('Error indexing submission reviews:', error)
      }
    }
  }

  async indexSubjects() {
    try {
      const codeIndexExists = await this.subjects.indexExists(['code_1'])
      if (!codeIndexExists) {
        await this.subjects.createIndex({ code: 1 }, { unique: true })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.subjects.createIndex({ code: 1 }, { unique: true })
      } else {
        console.error('Error indexing subjects:', error)
      }
    }
  }

  async indexTests() {
    try {
      const classIdIndexExists = await this.tests.indexExists(['classId_1'])
      if (!classIdIndexExists) {
        await this.tests.createIndex({ classId: 1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.tests.createIndex({ classId: 1 })
      } else {
        console.error('Error indexing tests:', error)
      }
    }
  }

  async indexTestAttempts() {
    try {
      const testIdIndexExists = await this.testAttempts.indexExists(['testId_1'])
      if (!testIdIndexExists) {
        await this.testAttempts.createIndex({ testId: 1 })
      }
      const studentIdIndexExists = await this.testAttempts.indexExists(['studentId_1'])
      if (!studentIdIndexExists) {
        await this.testAttempts.createIndex({ studentId: 1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.testAttempts.createIndex({ testId: 1 })
        await this.testAttempts.createIndex({ studentId: 1 })
      } else {
        console.error('Error indexing test attempts:', error)
  async indexNotifications() {
    try {
      const userReadIndexExists = await this.notifications.indexExists(['userId_1_isRead_1'])
      if (!userReadIndexExists) {
        await this.notifications.createIndex({ userId: 1, isRead: 1 })
      }

      const typeIndexExists = await this.notifications.indexExists(['type_1'])
      if (!typeIndexExists) {
        await this.notifications.createIndex({ type: 1 })
      }

      const relatedIndexExists = await this.notifications.indexExists(['relatedEntityType_1_relatedEntityId_1'])
      if (!relatedIndexExists) {
        await this.notifications.createIndex({ relatedEntityType: 1, relatedEntityId: 1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.notifications.createIndex({ userId: 1, isRead: 1 })
        await this.notifications.createIndex({ type: 1 })
        await this.notifications.createIndex({ relatedEntityType: 1, relatedEntityId: 1 })
      } else {
        console.error('Error indexing notifications:', error)
      }
    }
  }

  async indexEmailLogs() {
    try {
      const toIndexExists = await this.emailLogs.indexExists(['to_1'])
      if (!toIndexExists) {
        await this.emailLogs.createIndex({ to: 1 })
      }

      const typeIndexExists = await this.emailLogs.indexExists(['type_1'])
      if (!typeIndexExists) {
        await this.emailLogs.createIndex({ type: 1 })
      }

      const statusIndexExists = await this.emailLogs.indexExists(['status_1'])
      if (!statusIndexExists) {
        await this.emailLogs.createIndex({ status: 1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.emailLogs.createIndex({ to: 1 })
        await this.emailLogs.createIndex({ type: 1 })
        await this.emailLogs.createIndex({ status: 1 })
      } else {
        console.error('Error indexing email logs:', error)
      }
    }
  }

  async indexAssignments() {
    try {
      const sessionIndexExists = await this.assignments.indexExists(['sessionId_1_status_1'])
      if (!sessionIndexExists) {
        await this.assignments.createIndex({ sessionId: 1, status: 1 })
      }

      const classIndexExists = await this.assignments.indexExists(['classId_1_status_1_deadline_1'])
      if (!classIndexExists) {
        await this.assignments.createIndex({ classId: 1, status: 1, deadline: 1 })
      }

      const materialIndexExists = await this.assignmentMaterials.indexExists(['assignmentId_1_createdAt_-1'])
      if (!materialIndexExists) {
        await this.assignmentMaterials.createIndex({ assignmentId: 1, createdAt: -1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.assignments.createIndex({ sessionId: 1, status: 1 })
        await this.assignments.createIndex({ classId: 1, status: 1, deadline: 1 })
        await this.assignmentMaterials.createIndex({ assignmentId: 1, createdAt: -1 })
      } else {
        console.error('Error indexing assignments:', error)
      }
    }
  }

  async indexChatRooms() {
    try {
      const memberIdsIndexExists = await this.chatRooms.indexExists(['memberIds_1'])
      if (!memberIdsIndexExists) {
        await this.chatRooms.createIndex({ memberIds: 1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.chatRooms.createIndex({ memberIds: 1 })
      } else {
        console.error('Error indexing chat rooms:', error)
      }
    }
  }

  async indexChatMessages() {
    try {
      const roomIdIndexExists = await this.chatMessages.indexExists(['roomId_1_createdAt_1'])
      if (!roomIdIndexExists) {
        await this.chatMessages.createIndex({ roomId: 1, createdAt: 1 })
      }
      const senderIdIndexExists = await this.chatMessages.indexExists(['senderId_1'])
      if (!senderIdIndexExists) {
        await this.chatMessages.createIndex({ senderId: 1 })
      }
    } catch (error: any) {
      if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
        await this.chatMessages.createIndex({ roomId: 1, createdAt: 1 })
        await this.chatMessages.createIndex({ senderId: 1 })
      } else {
        console.error('Error indexing chat messages:', error)
      }
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION || 'users')
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION || 'refresh_tokens')
  }

  get passwordResetTokens(): Collection<PasswordResetToken> {
    return this.db.collection(process.env.DB_PASSWORD_RESET_TOKENS_COLLECTION || 'password_reset_tokens')
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

  get submissions(): Collection<Submission> {
    return this.db.collection(process.env.DB_SUBMISSIONS_COLLECTION || 'submissions')
  }

  get aiInteractions(): Collection<AiInteraction> {
    return this.db.collection(process.env.DB_AI_INTERACTIONS_COLLECTION || 'ai_interactions')
  }

  get aiEvaluations(): Collection<AiEvaluation> {
    return this.db.collection(process.env.DB_AI_EVALUATIONS_COLLECTION || 'ai_evaluations')
  }

  get submissionFlags(): Collection<SubmissionFlag> {
    return this.db.collection(process.env.DB_SUBMISSION_FLAGS_COLLECTION || 'submission_flags')
  }

  get submissionReviews(): Collection<SubmissionReview> {
    return this.db.collection(process.env.DB_SUBMISSION_REVIEWS_COLLECTION || 'submission_reviews')
  }

  get notifications(): Collection<any> {
    return this.db.collection(process.env.DB_NOTIFICATIONS_COLLECTION || 'notifications')
  }

  get emailLogs(): Collection<any> {
    return this.db.collection(process.env.DB_EMAIL_LOGS_COLLECTION || 'email_logs')
  }

  get departments(): Collection<any> {
    return this.db.collection(process.env.DB_DEPARTMENTS_COLLECTION || 'departments')
  }

  get semesters(): Collection<Semester> {
    return this.db.collection(process.env.DB_SEMESTERS_COLLECTION || 'semesters')
  }

  get subjects(): Collection<Subject> {
    return this.db.collection(process.env.DB_SUBJECTS_COLLECTION || 'subjects')
  }

  get classMembers(): Collection<any> {
    return this.db.collection(process.env.DB_CLASS_MEMBERS_COLLECTION || 'class_members')
  }

  get sessions(): Collection<any> {
    return this.db.collection(process.env.DB_SESSIONS_COLLECTION || 'sessions')
  }

  get assignments(): Collection<Assignment> {
    return this.db.collection(process.env.DB_ASSIGNMENTS_COLLECTION || 'assignments')
  }

  get assignmentMaterials(): Collection<any> {
    return this.db.collection(process.env.DB_ASSIGNMENT_MATERIALS_COLLECTION || 'assignment_materials')
  }

  get chatRooms(): Collection<ChatRoom> {
    return this.db.collection(process.env.DB_CHAT_ROOMS_COLLECTION || 'chat_rooms')
  }

  get chatMessages(): Collection<ChatMessage> {
    return this.db.collection(process.env.DB_CHAT_MESSAGES_COLLECTION || 'chat_messages')
  }

  get tests(): Collection<Test> {
    return this.db.collection(process.env.DB_TESTS_COLLECTION || 'tests')
  }

  get testAttempts(): Collection<TestAttempt> {
    return this.db.collection(process.env.DB_TEST_ATTEMPTS_COLLECTION || 'test_attempts')
  }
}

// run().catch(console.dir)
const databaseService = new DatabaseService()

export default databaseService
