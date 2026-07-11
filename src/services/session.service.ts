import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import Session, { SessionType } from '~/models/schemas/sessions.schema'

class SessionService {
  async createSession(classId: string, payload: Omit<SessionType, 'classId'>) {
    const newSession = new Session({
      ...payload,
      classId: new ObjectId(classId)
    })
    const result = await databaseService.sessions.insertOne(newSession)
    return { ...newSession, _id: result.insertedId }
  }

  async getSessionsByClassId(classId: string, page: number, limit: number) {
    const skip = (page - 1) * limit
    const filter = { classId: new ObjectId(classId) }
    
    const [docs, totalDocs] = await Promise.all([
      databaseService.sessions.find(filter).skip(skip).limit(limit).sort({ startTime: 1 }).toArray(),
      databaseService.sessions.countDocuments(filter)
    ])

    return {
      docs,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      page,
      limit
    }
  }

  async getSessionById(id: string) {
    return await databaseService.sessions.findOne({ _id: new ObjectId(id) })
  }

  async updateSession(id: string, payload: Partial<SessionType>) {
    const result = await databaseService.sessions.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteSession(id: string) {
    return await databaseService.sessions.findOneAndDelete({ _id: new ObjectId(id) })
  }
}

const sessionService = new SessionService()
export default sessionService
