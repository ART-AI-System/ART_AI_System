import { ObjectId } from 'mongodb'

export interface SubjectType {
  _id?: ObjectId
  code: string
  name: string
  description?: string
  departmentId?: ObjectId
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class Subject {
  _id?: ObjectId
  code: string
  name: string
  description: string
  departmentId?: ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  constructor(subjectData: SubjectType) {
    const date = new Date()
    this._id = subjectData._id
    this.code = subjectData.code
    this.name = subjectData.name
    this.description = subjectData.description || ''
    this.departmentId = subjectData.departmentId
    this.isActive = subjectData.isActive ?? true
    this.createdAt = subjectData.createdAt || date
    this.updatedAt = subjectData.updatedAt || date
  }
}
