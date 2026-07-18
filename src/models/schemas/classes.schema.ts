import { ObjectId } from 'mongodb'

export interface LecturerSnapshot {
  lecturerId: ObjectId
  fullName: string
  email: string
}

export interface StudentSnapshot {
  studentId: ObjectId
  studentCode: string
  fullName: string
  email: string
}

export interface SubjectSnapshot {
  subjectId: ObjectId
  code: string
  name: string
}

export interface ClassType {
  _id?: ObjectId
  classCode: string
  semesterId: ObjectId
  subjectId: ObjectId
  subjectSnapshot: SubjectSnapshot
  lecturer: LecturerSnapshot
  students?: StudentSnapshot[]
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class Class {
  _id?: ObjectId
  classCode: string
  semesterId: ObjectId
  subjectId: ObjectId
  subjectSnapshot: SubjectSnapshot
  lecturer: LecturerSnapshot
  students: StudentSnapshot[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  constructor(classData: ClassType) {
    const date = new Date()
    this._id = classData._id
    this.classCode = classData.classCode
    this.semesterId = classData.semesterId
    this.subjectId = classData.subjectId
    this.subjectSnapshot = classData.subjectSnapshot
    this.lecturer = classData.lecturer
    this.students = classData.students || []
    this.isActive = classData.isActive ?? true
    this.createdAt = classData.createdAt || date
    this.updatedAt = classData.updatedAt || date
  }
}
