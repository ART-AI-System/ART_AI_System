import { Router } from 'express'
import { param } from 'express-validator'
import { requireAuth } from '~/middlewares/auth.middlewares'
import { validate } from '~/utils/validation'
import {
  getStudentHomeController,
  getSubjectsBySemesterController,
  getClassSessionsController
} from '~/controllers/student.controllers'
import { getStudentScheduleController } from '~/controllers/sessions.controller'

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

const studentRouter = Router()

/**
 * All student routes require authentication but no specific role check
 * because they are self-scoped to the currently authenticated user.
 */
studentRouter.use(requireAuth)

studentRouter.get('/home', getStudentHomeController)

studentRouter.get('/me/schedule', getStudentScheduleController)

studentRouter.get(
  '/semesters/:semesterId/subjects',
  validateObjectIdParam('semesterId'),
  getSubjectsBySemesterController
)

studentRouter.get(
  '/classes/:classId/sessions',
  validateObjectIdParam('classId'),
  getClassSessionsController
)

export default studentRouter
