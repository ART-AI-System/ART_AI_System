import { ObjectId } from 'mongodb'

export type SubmissionStatus = 'draft' | 'submitted' | 'evaluated' | 'reviewed' | 'graded' | 'flagged' | 'late' | 'withdrawn'

export interface SubmissionType {
  _id?: ObjectId
  uuid: string
  gradeItemId: ObjectId
  classId: ObjectId
  studentId: ObjectId
  versionNumber?: number
  fileName: string
  fileStorageKey: string
  fileSize: number
  mimeType: string
  contentHash?: string | null
  status?: SubmissionStatus
  submittedAt?: Date
  isLatest?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class Submission {
  _id?: ObjectId
  uuid: string
  gradeItemId: ObjectId
  classId: ObjectId
  studentId: ObjectId
  versionNumber: number
  fileName: string
  fileStorageKey: string
  fileSize: number
  mimeType: string
  contentHash: string | null
  status: SubmissionStatus
  submittedAt: Date
  isLatest: boolean
  createdAt: Date
  updatedAt: Date

  constructor(submission: SubmissionType) {
    const date = new Date()
    this._id = submission._id
    this.uuid = submission.uuid
    this.gradeItemId = submission.gradeItemId
    this.classId = submission.classId
    this.studentId = submission.studentId
    this.versionNumber = submission.versionNumber ?? 1
    this.fileName = submission.fileName
    this.fileStorageKey = submission.fileStorageKey
    this.fileSize = submission.fileSize
    this.mimeType = submission.mimeType
    this.contentHash = submission.contentHash ?? null
    this.status = submission.status ?? 'draft'
    this.submittedAt = submission.submittedAt || date
    this.isLatest = submission.isLatest ?? true
    this.createdAt = submission.createdAt || date
    this.updatedAt = submission.updatedAt || date
  }
}
