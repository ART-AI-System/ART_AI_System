import { ObjectId } from 'mongodb'
import { UserRole } from './users.schema'

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

export interface ClassType {
  _id?: ObjectId
  classCode: string
  subjectName: string
  semester: string
  academicYear: string
  department?: any
  lecturer: LecturerSnapshot
  students?: StudentSnapshot[]
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class Class {
  _id?: ObjectId
  classCode: string
  subjectName: string
  semester: string
  academicYear: string
  department: any
  lecturer: LecturerSnapshot
  students: StudentSnapshot[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  constructor(classData: ClassType) {
    const date = new Date()
    this._id = classData._id
    this.classCode = classData.classCode
    this.subjectName = classData.subjectName
    this.semester = classData.semester
    this.academicYear = classData.academicYear
    this.department = classData.department || {}
    this.lecturer = classData.lecturer
    this.students = classData.students || []
    this.isActive = classData.isActive ?? true
    this.createdAt = classData.createdAt || date
    this.updatedAt = classData.updatedAt || date
  }
}
