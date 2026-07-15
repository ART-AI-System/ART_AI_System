import { ReviewStatus } from '~/models/schemas/submissionReviews.schema'

export interface AddSubmissionCommentReqBody {
  comment: string
}

export interface UpdateReviewStatusReqBody {
  reviewStatus?: ReviewStatus
  status?: ReviewStatus
}
