import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import Subject, { SubjectType } from '~/models/schemas/subjects.schema'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class SubjectsService {
  async createSubject(payload: SubjectType) {
    if (payload.departmentId) {
      payload.departmentId = new ObjectId(payload.departmentId)
    }
    const subject = new Subject(payload)
    const result = await databaseService.subjects.insertOne(subject)
    return await databaseService.subjects.findOne({ _id: result.insertedId })
  }

  async getSubjects() {
    return await databaseService.subjects.find({}).sort({ code: 1 }).toArray()
  }

  async getSubjectById(id: string) {
    const subject = await databaseService.subjects.findOne({ _id: new ObjectId(id) })
    if (!subject) {
      throw new ErrorWithStatus({
        message: 'Subject not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return subject
  }

  async updateSubject(id: string, payload: Partial<SubjectType>) {
    payload.updatedAt = new Date()
    if (payload.departmentId) {
      payload.departmentId = new ObjectId(payload.departmentId)
    }
    const result = await databaseService.subjects.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: payload },
      { returnDocument: 'after' }
    )
    if (!result) {
      throw new ErrorWithStatus({
        message: 'Subject not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // Auto-generate missing sessions for existing classes if defaultSlots is provided
    if (payload.defaultSlots) {
      const targetSlots = payload.defaultSlots
      const classes = await databaseService.classes.find({ subjectId: new ObjectId(id) }).toArray()
      
      const now = new Date()
      for (const cls of classes) {
        const existingSessionsCount = await databaseService.sessions.countDocuments({ classId: cls._id })
        if (existingSessionsCount < targetSlots) {
          const sessionsToInsert = []
          for (let i = existingSessionsCount + 1; i <= targetSlots; i++) {
            sessionsToInsert.push({
              classId: cls._id,
              sessionNo: i,
              title: `Session ${i}`,
              description: '',
              startTime: now,
              endTime: now,
              createdAt: now,
              updatedAt: now
            })
          }
          if (sessionsToInsert.length > 0) {
            await databaseService.sessions.insertMany(sessionsToInsert)
          }
        }
      }
    }

    return result
  }

  async toggleSubjectStatus(id: string, isActive: boolean) {
    const result = await databaseService.subjects.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isActive, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    if (!result) {
      throw new ErrorWithStatus({
        message: 'Subject not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return result
  }
}

const subjectsService = new SubjectsService()
export default subjectsService
