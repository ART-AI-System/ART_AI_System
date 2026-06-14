import { Router } from 'express'
import {
  createSubmissionController,
  downloadSubmissionController,
  getMySubmissionByGradeItemController,
  getMySubmissionsController,
  getSubmissionByIdController,
  getSubmissionsByGradeItemController
} from '~/controllers/submissions.controller'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { parseSubmissionFile } from '~/middlewares/submissions.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const submissionsRouter = Router()

submissionsRouter.post(
  '/grade-items/:gradeItemId/submissions',
  requireAuth,
  requireRole('STUDENT'),
  parseSubmissionFile,
  wrapRequestHandler(createSubmissionController)
)

submissionsRouter.get(
  '/grade-items/:gradeItemId/submissions/my',
  requireAuth,
  requireRole('STUDENT'),
  wrapRequestHandler(getMySubmissionByGradeItemController)
)

submissionsRouter.get(
  '/grade-items/:gradeItemId/submissions',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(getSubmissionsByGradeItemController)
)

submissionsRouter.get('/submissions/:id', requireAuth, wrapRequestHandler(getSubmissionByIdController))

submissionsRouter.get('/submissions/:id/download', requireAuth, wrapRequestHandler(downloadSubmissionController))

submissionsRouter.get(
  '/students/me/submissions',
  requireAuth,
  requireRole('STUDENT'),
  wrapRequestHandler(getMySubmissionsController)
)

export default submissionsRouter
