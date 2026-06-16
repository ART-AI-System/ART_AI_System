import { Router } from 'express'
import { param } from 'express-validator'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { validate } from '~/utils/validation'
import { wrapRequestHandler } from '~/utils/handlers'
import {
  evaluateSubmissionController,
  getEvaluationBySubmissionController,
  getEvaluationsByClassController,
  getEvaluationsByStudentController,
  recalculateEvaluationController
} from '~/controllers/aiEvaluation.controllers'

const validateObjectIdParam = (paramName: string) =>
  validate({
    run: async (req: any) => {
      await param(paramName)
        .isMongoId()
        .withMessage(`${paramName} must be a valid MongoDB ObjectId`)
        .run(req)
    }
  } as any)

const aiEvaluationRouter = Router()

aiEvaluationRouter.post(
  '/submissions/:submissionId/ai-evaluation',
  requireAuth,
  requireRole('LECTURER', 'ADMIN'),
  validateObjectIdParam('submissionId'),
  wrapRequestHandler(evaluateSubmissionController)
)

aiEvaluationRouter.post(
  '/submissions/:submissionId/ai-evaluation/recalculate',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD', 'ADMIN'),
  validateObjectIdParam('submissionId'),
  wrapRequestHandler(recalculateEvaluationController)
)

aiEvaluationRouter.get(
  '/submissions/:submissionId/ai-evaluation',
  requireAuth,
  validateObjectIdParam('submissionId'),
  wrapRequestHandler(getEvaluationBySubmissionController)
)

aiEvaluationRouter.get(
  '/classes/:classId/ai-evaluations',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD', 'ADMIN'),
  validateObjectIdParam('classId'),
  wrapRequestHandler(getEvaluationsByClassController)
)

aiEvaluationRouter.get(
  '/students/:studentId/ai-evaluations',
  requireAuth,
  validateObjectIdParam('studentId'),
  wrapRequestHandler(getEvaluationsByStudentController)
)

export default aiEvaluationRouter
