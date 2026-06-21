import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import Semester, { SemesterType } from '~/models/schemas/semesters.schema'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class SemestersService {
  async createSemester(payload: SemesterType) {
    // If setting this to current, unset others
    if (payload.isCurrent) {
      await databaseService.semesters.updateMany({}, { $set: { isCurrent: false } })
    }
    const semester = new Semester(payload)
    const result = await databaseService.semesters.insertOne(semester)
    return await databaseService.semesters.findOne({ _id: result.insertedId })
  }

  async getSemesters() {
    return await databaseService.semesters.find({}).sort({ startDate: -1 }).toArray()
  }

  async getCurrentSemester() {
    return await databaseService.semesters.findOne({ isCurrent: true })
  }

  async getSemesterById(id: string) {
    const semester = await databaseService.semesters.findOne({ _id: new ObjectId(id) })
    if (!semester) {
      throw new ErrorWithStatus({
        message: 'Semester not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return semester
  }

  async updateSemester(id: string, payload: Partial<SemesterType>) {
    payload.updatedAt = new Date()
    const result = await databaseService.semesters.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: payload },
      { returnDocument: 'after' }
    )
    if (!result) {
      throw new ErrorWithStatus({
        message: 'Semester not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return result
  }

  async setCurrentSemester(id: string) {
    // Unset all first
    await databaseService.semesters.updateMany({}, { $set: { isCurrent: false } })
    
    const result = await databaseService.semesters.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isCurrent: true, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    if (!result) {
      throw new ErrorWithStatus({
        message: 'Semester not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return result
  }

  async toggleSemesterStatus(id: string, isActive: boolean) {
    const result = await databaseService.semesters.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isActive, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    if (!result) {
      throw new ErrorWithStatus({
        message: 'Semester not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return result
  }
}

const semestersService = new SemestersService()
export default semestersService
