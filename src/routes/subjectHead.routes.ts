import { Router } from 'express'
import { param } from 'express-validator'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { validate } from '~/utils/validation'
import {
  getOverviewController,
  getClassesController,
  getClassAnalyticsController,
  getSubjectAnalyticsController,
  getStudentDetailController,
  getLecturerAnalyticsController
} from '~/controllers/subjectHead.controllers'

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

const subjectHeadRouter = Router()

subjectHeadRouter.use(requireAuth, requireRole('SUBJECT_HEAD'))

subjectHeadRouter.get('/overview', getOverviewController)
subjectHeadRouter.get('/classes', getClassesController)

subjectHeadRouter.get(
  '/classes/:classId/analytics',
  validateObjectIdParam('classId'),
  getClassAnalyticsController
)

subjectHeadRouter.get(
  '/subjects/:subjectId/analytics',
  validateObjectIdParam('subjectId'),
  getSubjectAnalyticsController
)

subjectHeadRouter.get(
  '/students/:studentId/detail',
  validateObjectIdParam('studentId'),
  getStudentDetailController
)

subjectHeadRouter.get(
  '/lecturers/:lecturerId/analytics',
  validateObjectIdParam('lecturerId'),
  getLecturerAnalyticsController
)

export default subjectHeadRouter
