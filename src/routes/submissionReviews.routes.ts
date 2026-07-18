import { Router } from 'express'
import {
  addSubmissionCommentController,
  getSubmissionOverviewController,
  getSubmissionReviewController,
  updateReviewStatusController,
  createSubmissionReviewController
} from '~/controllers/submissionReviews.controller'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const submissionReviewsRouter = Router()

// GET /api/lecturer/classes/:classId/submission-overview
submissionReviewsRouter.get(
  '/lecturer/classes/:classId/submission-overview',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(getSubmissionOverviewController)
)

// GET /api/submissions/:id/review
submissionReviewsRouter.get(
  '/submissions/:id/review',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  wrapRequestHandler(getSubmissionReviewController)
)

// POST /api/submissions/:id/review
submissionReviewsRouter.post(
  '/submissions/:id/review',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(createSubmissionReviewController)
)

// POST /api/submissions/:id/comments
submissionReviewsRouter.post(
  '/submissions/:id/comments',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(addSubmissionCommentController)
)

// PATCH /api/submissions/:id/review-status
submissionReviewsRouter.patch(
  '/submissions/:id/review-status',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(updateReviewStatusController)
)

export default submissionReviewsRouter
