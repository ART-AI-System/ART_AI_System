import { Router } from 'express'
import {
  addSubmissionCommentController,
  getSubmissionOverviewController,
  getSubmissionReviewController,
  updateReviewStatusController
} from '~/controllers/submissionReviews.controller'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const submissionReviewsRouter = Router()

submissionReviewsRouter.get(
  '/classes/:classId/submission-overview',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(getSubmissionOverviewController)
)

submissionReviewsRouter.get(
  '/submissions/:id/review',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(getSubmissionReviewController)
)

submissionReviewsRouter.post(
  '/submissions/:id/comments',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(addSubmissionCommentController)
)

submissionReviewsRouter.patch(
  '/submissions/:id/review-status',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(updateReviewStatusController)
)

export default submissionReviewsRouter
