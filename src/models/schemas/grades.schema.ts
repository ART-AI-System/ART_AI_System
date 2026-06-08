import { ObjectId } from 'mongodb'

export interface GradeType {
  _id?: ObjectId
  submissionId: ObjectId
  studentId: ObjectId
  classId: ObjectId
  gradeItemId: ObjectId
  score: number
  maxScore?: number
  feedback?: string
  gradedBy: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

export default class Grade {
  _id?: ObjectId
  submissionId: ObjectId
  studentId: ObjectId
  classId: ObjectId
  gradeItemId: ObjectId
  score: number
  maxScore: number
  feedback: string
  gradedBy: ObjectId
  createdAt: Date
  updatedAt: Date

  constructor(grade: GradeType) {
    this._id = grade._id || new ObjectId()
    this.submissionId = grade.submissionId
    this.studentId = grade.studentId
    this.classId = grade.classId
    this.gradeItemId = grade.gradeItemId
    this.score = grade.score
    this.maxScore = grade.maxScore || 10
    this.feedback = grade.feedback || ''
    this.gradedBy = grade.gradedBy
    this.createdAt = grade.createdAt || new Date()
    this.updatedAt = grade.updatedAt || new Date()
  }
}
