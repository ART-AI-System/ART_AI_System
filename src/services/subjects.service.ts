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
