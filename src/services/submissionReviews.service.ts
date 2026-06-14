import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { AddSubmissionCommentReqBody, UpdateReviewStatusReqBody } from '~/models/requests/submissionReviews.request'
import SubmissionReview, { ReviewStatus } from '~/models/schemas/submissionReviews.schema'
import databaseService from '~/services/database.service'

const VALID_REVIEW_STATUSES: ReviewStatus[] = ['PENDING', 'REVIEWED', 'NEEDS_REVISION', 'FLAGGED']

function toObjectId(id: string, entityName: string) {
  if (!ObjectId.isValid(id)) {
    throw new ErrorWithStatus({
      message: `${entityName} id is invalid`,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  return new ObjectId(id)
}

class SubmissionReviewsService {
  async getSubmissionOverview(classId: string, lecturerId: string) {
    const classObjectId = toObjectId(classId, 'Class')
    const lecturerObjectId = toObjectId(lecturerId, 'Lecturer')
    const classData = await this.getLecturerClassOrFail(classObjectId, lecturerObjectId)

    const [gradeItems, submissions, reviews] = await Promise.all([
      databaseService.gradeItems.find({ classId: classObjectId }).sort({ sequenceOrder: 1 }).toArray(),
      databaseService.submissions.find({ classId: classObjectId, isLatest: true }).sort({ submittedAt: -1 }).toArray(),
      databaseService.submissionReviews.find({ lecturerId: lecturerObjectId }).toArray()
    ])

    const gradeItemMap = new Map(gradeItems.map((item) => [item._id?.toString(), item]))
    const reviewMap = new Map(reviews.map((review) => [review.submissionId.toString(), review]))

    const overview = submissions.map((submission) => {
      const student = classData.students.find(
        (studentSnapshot) => studentSnapshot.studentId.toString() === submission.studentId.toString()
      )
      const gradeItem = gradeItemMap.get(submission.gradeItemId.toString())
      const review = reviewMap.get((submission._id as ObjectId).toString())

      return {
        submission,
        student: student ?? null,
        gradeItem: gradeItem
          ? {
              _id: gradeItem._id,
              title: gradeItem.title,
              weight: gradeItem.weight,
              maxScore: gradeItem.maxScore,
              deadline: gradeItem.deadline
            }
          : null,
        review: review ?? {
          submissionId: submission._id,
          lecturerId: lecturerObjectId,
          reviewStatus: 'PENDING',
          comment: '',
          reviewedAt: null
        }
      }
    })

    return {
      class: classData,
      totalSubmissions: overview.length,
      pendingReviews: overview.filter((item) => item.review.reviewStatus === 'PENDING').length,
      reviewedSubmissions: overview.filter((item) => item.review.reviewStatus === 'REVIEWED').length,
      flaggedSubmissions: overview.filter((item) => item.review.reviewStatus === 'FLAGGED').length,
      submissions: overview
    }
  }

  async getSubmissionReview(submissionId: string, lecturerId: string) {
    const submissionObjectId = toObjectId(submissionId, 'Submission')
    const lecturerObjectId = toObjectId(lecturerId, 'Lecturer')
    const submission = await this.getLecturerSubmissionOrFail(submissionObjectId, lecturerObjectId)

    const review = await databaseService.submissionReviews.findOne({
      submissionId: submissionObjectId,
      lecturerId: lecturerObjectId
    })

    return {
      submission,
      review: review ?? {
        submissionId: submissionObjectId,
        lecturerId: lecturerObjectId,
        reviewStatus: 'PENDING',
        comment: '',
        reviewedAt: null
      }
    }
  }

  async addComment(submissionId: string, lecturerId: string, payload: AddSubmissionCommentReqBody) {
    const submissionObjectId = toObjectId(submissionId, 'Submission')
    const lecturerObjectId = toObjectId(lecturerId, 'Lecturer')
    await this.getLecturerSubmissionOrFail(submissionObjectId, lecturerObjectId)

    const comment = payload.comment?.trim()
    if (!comment) {
      throw new ErrorWithStatus({
        message: 'Comment is required',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const existingReview = await databaseService.submissionReviews.findOne({
      submissionId: submissionObjectId,
      lecturerId: lecturerObjectId
    })

    if (existingReview) {
      return await databaseService.submissionReviews.findOneAndUpdate(
        { _id: existingReview._id },
        {
          $set: {
            comment,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )
    }

    const review = new SubmissionReview({
      submissionId: submissionObjectId,
      lecturerId: lecturerObjectId,
      comment
    })
    const result = await databaseService.submissionReviews.insertOne(review)
    return { ...review, _id: result.insertedId }
  }

  async updateReviewStatus(submissionId: string, lecturerId: string, payload: UpdateReviewStatusReqBody) {
    const submissionObjectId = toObjectId(submissionId, 'Submission')
    const lecturerObjectId = toObjectId(lecturerId, 'Lecturer')
    await this.getLecturerSubmissionOrFail(submissionObjectId, lecturerObjectId)

    const reviewStatus = payload.reviewStatus || payload.status
    if (!reviewStatus || !VALID_REVIEW_STATUSES.includes(reviewStatus)) {
      throw new ErrorWithStatus({
        message: 'Review status must be PENDING, REVIEWED, NEEDS_REVISION, or FLAGGED',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const existingReview = await databaseService.submissionReviews.findOne({
      submissionId: submissionObjectId,
      lecturerId: lecturerObjectId
    })

    const updateData = {
      reviewStatus,
      reviewedAt: new Date(),
      updatedAt: new Date()
    }

    if (existingReview) {
      const review = await databaseService.submissionReviews.findOneAndUpdate(
        { _id: existingReview._id },
        {
          $set: updateData
        },
        { returnDocument: 'after' }
      )
      await this.syncSubmissionStatus(submissionObjectId, reviewStatus)
      return review
    }

    const review = new SubmissionReview({
      submissionId: submissionObjectId,
      lecturerId: lecturerObjectId,
      reviewStatus,
      reviewedAt: updateData.reviewedAt
    })
    const result = await databaseService.submissionReviews.insertOne(review)
    await this.syncSubmissionStatus(submissionObjectId, reviewStatus)
    return { ...review, _id: result.insertedId }
  }

  private async getLecturerClassOrFail(classId: ObjectId, lecturerId: ObjectId) {
    const classData = await databaseService.classes.findOne({
      _id: classId,
      'lecturer.lecturerId': lecturerId,
      isActive: { $ne: false }
    })

    if (!classData) {
      throw new ErrorWithStatus({
        message: 'You do not have permission to review submissions for this class',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    return classData
  }

  private async getLecturerSubmissionOrFail(submissionId: ObjectId, lecturerId: ObjectId) {
    const submission = await databaseService.submissions.findOne({ _id: submissionId })

    if (!submission) {
      throw new ErrorWithStatus({
        message: 'Submission not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await this.getLecturerClassOrFail(submission.classId, lecturerId)
    return submission
  }

  private async syncSubmissionStatus(submissionId: ObjectId, reviewStatus: ReviewStatus) {
    const submissionStatus = reviewStatus === 'FLAGGED' ? 'flagged' : reviewStatus === 'PENDING' ? 'submitted' : 'reviewed'

    await databaseService.submissions.updateOne(
      { _id: submissionId },
      {
        $set: {
          status: submissionStatus,
          updatedAt: new Date()
        }
      }
    )
  }
}

const submissionReviewsService = new SubmissionReviewsService()
export default submissionReviewsService
