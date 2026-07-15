import { ObjectId } from 'mongodb'

export interface SessionType {
  _id?: ObjectId
  classId: ObjectId
  sessionNo: number
  title: string
  description?: string
  startTime: Date
  endTime: Date
  createdAt?: Date
  updatedAt?: Date
}

export default class Session {
  _id?: ObjectId
  classId: ObjectId
  sessionNo: number
  title: string
  description?: string
  startTime: Date
  endTime: Date
  createdAt: Date
  updatedAt: Date

  constructor(session: SessionType) {
    const date = new Date()
    this._id = session._id
    this.classId = session.classId
    this.sessionNo = session.sessionNo
    this.title = session.title
    this.description = session.description
    this.startTime = session.startTime
    this.endTime = session.endTime
    this.createdAt = session.createdAt || date
    this.updatedAt = session.updatedAt || date
  }
}
