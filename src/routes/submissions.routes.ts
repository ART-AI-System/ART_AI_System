import { Router } from 'express'
import {
  createSubmissionController,
  downloadSubmissionController,
  downloadSubmissionVersionController,
  getSubmissionFileContentController,
  getSubmissionFileTreeController,
  getMySubmissionByGradeItemController,
  getMySubmissionsController,
  getSubmissionByIdController,
  getSubmissionVersionByIdController,
  getSubmissionVersionsController,
  getSubmissionsByGradeItemController,
  getSubmissionHeatmapController,
  finalizeSubmissionController,
  resubmitSubmissionVersionController,
  withdrawSubmissionController,
  updateSubmissionGroupMembersController
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

submissionsRouter.post(
  '/assignments/:assignmentId/submissions',
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
  '/assignments/:assignmentId/submissions/my',
  requireAuth,
  requireRole('STUDENT'),
  wrapRequestHandler(getMySubmissionByGradeItemController)
)

submissionsRouter.get(
  '/grade-items/:gradeItemId/submissions',
  requireAuth,
  wrapRequestHandler(getSubmissionsByGradeItemController)
)

submissionsRouter.get(
  '/assignments/:assignmentId/submissions',
  requireAuth,
  wrapRequestHandler(getSubmissionsByGradeItemController)
)

submissionsRouter.get('/submissions/:id', requireAuth, wrapRequestHandler(getSubmissionByIdController))

submissionsRouter.get('/submissions/:id/download', requireAuth, wrapRequestHandler(downloadSubmissionController))

submissionsRouter.get(
  '/submissions/:submissionId/tree',
  requireAuth,
  wrapRequestHandler(getSubmissionFileTreeController)
)

submissionsRouter.get(
  '/submissions/:submissionId/file',
  requireAuth,
  wrapRequestHandler(getSubmissionFileContentController)
)

submissionsRouter.get(
  '/submissions/:submissionId/versions',
  requireAuth,
  wrapRequestHandler(getSubmissionVersionsController)
)

submissionsRouter.post(
  '/submissions/:submissionId/versions',
  requireAuth,
  requireRole('STUDENT'),
  parseSubmissionFile,
  wrapRequestHandler(resubmitSubmissionVersionController)
)

submissionsRouter.get(
  '/submission-versions/:versionId',
  requireAuth,
  wrapRequestHandler(getSubmissionVersionByIdController)
)

submissionsRouter.get(
  '/submission-versions/:versionId/download',
  requireAuth,
  wrapRequestHandler(downloadSubmissionVersionController)
)

submissionsRouter.post(
  '/submissions/:id/finalize',
  requireAuth,
  requireRole('STUDENT'),
  wrapRequestHandler(finalizeSubmissionController)
)

submissionsRouter.put(
  '/submissions/:id/group-members',
  requireAuth,
  requireRole('STUDENT'),
  wrapRequestHandler(updateSubmissionGroupMembersController)
)

submissionsRouter.get(
  '/students/me/submissions',
  requireAuth,
  requireRole('STUDENT'),
  wrapRequestHandler(getMySubmissionsController)
)

submissionsRouter.get(
  '/students/:studentId/submission-heatmap',
  requireAuth,
  wrapRequestHandler(getSubmissionHeatmapController)
)

submissionsRouter.delete(
  '/submissions/:id',
  requireAuth,
  requireRole('STUDENT', 'LECTURER'),
  wrapRequestHandler(withdrawSubmissionController)
)

export default submissionsRouter
