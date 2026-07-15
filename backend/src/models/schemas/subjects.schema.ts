import { ObjectId } from 'mongodb'

export interface SubjectType {
  _id?: ObjectId
  code: string
  name: string
  description?: string
  defaultSlots?: number
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
  defaultSlots: number
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
    this.defaultSlots = subjectData.defaultSlots || 10
    this.departmentId = subjectData.departmentId
    this.isActive = subjectData.isActive ?? true
    this.createdAt = subjectData.createdAt || date
    this.updatedAt = subjectData.updatedAt || date
  }
}
