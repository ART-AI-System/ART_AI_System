import { ObjectId } from 'mongodb'

export type ReviewStatus = 'PENDING' | 'REVIEWED' | 'NEEDS_REVISION' | 'FLAGGED'

export interface SubmissionReviewType {
  _id?: ObjectId
  submissionId: ObjectId
  lecturerId: ObjectId
  reviewStatus?: ReviewStatus
  comment?: string
  reviewedAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export default class SubmissionReview {
  _id?: ObjectId
  submissionId: ObjectId
  lecturerId: ObjectId
  reviewStatus: ReviewStatus
  comment: string
  reviewedAt: Date | null
  createdAt: Date
  updatedAt: Date

  constructor(review: SubmissionReviewType) {
    const date = new Date()
    this._id = review._id
    this.submissionId = review.submissionId
    this.lecturerId = review.lecturerId
    this.reviewStatus = review.reviewStatus ?? 'PENDING'
    this.comment = review.comment ?? ''
    this.reviewedAt = review.reviewedAt ?? null
    this.createdAt = review.createdAt || date
    this.updatedAt = review.updatedAt || date
  }
}
