import { ObjectId } from 'mongodb'

export interface SemesterType {
  _id?: ObjectId
  code: string
  name: string
  academicYear: string
  startDate: Date
  endDate: Date
  isCurrent?: boolean
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class Semester {
  _id?: ObjectId
  code: string
  name: string
  academicYear: string
  startDate: Date
  endDate: Date
  isCurrent: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  constructor(semesterData: SemesterType) {
    const date = new Date()
    this._id = semesterData._id
    this.code = semesterData.code
    this.name = semesterData.name
    this.academicYear = semesterData.academicYear
    this.startDate = semesterData.startDate
    this.endDate = semesterData.endDate
    this.isCurrent = semesterData.isCurrent ?? false
    this.isActive = semesterData.isActive ?? true
    this.createdAt = semesterData.createdAt || date
    this.updatedAt = semesterData.updatedAt || date
  }
}
