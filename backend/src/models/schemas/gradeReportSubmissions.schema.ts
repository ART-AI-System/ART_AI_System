import { ObjectId } from 'mongodb'

export type GradeReportStatusType = 'pending' | 'approved' | 'rejected'

export interface GradeReportSubmissionType {
  _id?: ObjectId
  classId: ObjectId
  lecturerId: ObjectId
  subjectHeadId?: ObjectId
  status: GradeReportStatusType
  note?: string
  reviewNote?: string
  averageScore?: number
  totalStudents?: number
  submittedAt: Date
  reviewedAt?: Date
}

export default class GradeReportSubmission {
  _id?: ObjectId
  classId: ObjectId
  lecturerId: ObjectId
  subjectHeadId?: ObjectId
  status: GradeReportStatusType
  note?: string
  reviewNote?: string
  averageScore?: number
  totalStudents?: number
  submittedAt: Date
  reviewedAt?: Date

  constructor(data: GradeReportSubmissionType) {
    this._id = data._id || new ObjectId()
    this.classId = data.classId
    this.lecturerId = data.lecturerId
    this.subjectHeadId = data.subjectHeadId
    this.status = data.status
    this.note = data.note
    this.reviewNote = data.reviewNote
    this.averageScore = data.averageScore
    this.totalStudents = data.totalStudents
    this.submittedAt = data.submittedAt
    this.reviewedAt = data.reviewedAt
  }
}
