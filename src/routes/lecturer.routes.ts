import { Router } from 'express'
import { param, body } from 'express-validator'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { validate } from '~/utils/validation'
import {
  getLecturerHomeController,
  getClassOverviewController,
  getSubmissionStatisticsController,
  getAiStatisticsController,
  submitGradeReportController
} from '~/controllers/lecturer.controllers'

const validateObjectIdParam = (paramName: string) =>
  validate(
    {
      run: async (req: any) => {
        await param(paramName)
          .isMongoId()
          .withMessage(`${paramName} must be a valid MongoDB ObjectId`)
          .run(req)
      }
    } as any
  )

const lecturerRouter = Router()

lecturerRouter.use(requireAuth, requireRole('LECTURER'))

lecturerRouter.get('/home', getLecturerHomeController)

lecturerRouter.get(
  '/classes/:classId/overview',
  validateObjectIdParam('classId'),
  getClassOverviewController
)

lecturerRouter.get(
  '/classes/:classId/submission-statistics',
  validateObjectIdParam('classId'),
  getSubmissionStatisticsController
)

lecturerRouter.get(
  '/classes/:classId/ai-statistics',
  validateObjectIdParam('classId'),
  getAiStatisticsController
)

lecturerRouter.post(
  '/classes/:classId/grade-report/submit',
  validateObjectIdParam('classId'),
  validate(
    {
      run: async (req: any) => {
        await body('note').optional().isString().trim().run(req)
      }
    } as any
  ),
  submitGradeReportController
)

export default lecturerRouter
