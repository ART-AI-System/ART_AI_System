import { Router } from 'express'
import { param, query, body } from 'express-validator'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { validate } from '~/utils/validation'
import {
  getOverviewController,
  getClassesController,
  getClassAnalyticsController,
  getSubjectAnalyticsController,
  getStudentDetailController,
  getLecturerAnalyticsController,
  getGradeReportsController,
  reviewGradeReportController
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

subjectHeadRouter.get(
  '/grade-reports',
  validate(
    {
      run: async (req: any) => {
        await query('status')
          .optional()
          .isIn(['pending', 'approved', 'rejected'])
          .withMessage('status must be pending, approved, or rejected')
          .run(req)
      }
    } as any
  ),
  getGradeReportsController
)

subjectHeadRouter.patch(
  '/grade-reports/:reportId/approve',
  validateObjectIdParam('reportId'),
  reviewGradeReportController('approve')
)

subjectHeadRouter.patch(
  '/grade-reports/:reportId/reject',
  validateObjectIdParam('reportId'),
  validate(
    {
      run: async (req: any) => {
        await body('reviewNote')
          .notEmpty()
          .withMessage('reviewNote is required when rejecting')
          .isString()
          .trim()
          .run(req)
      }
    } as any
  ),
  reviewGradeReportController('reject')
)

subjectHeadRouter.patch(
  '/grade-reports/:reportId/reopen',
  validateObjectIdParam('reportId'),
  reviewGradeReportController('reopen')
)

export default subjectHeadRouter
