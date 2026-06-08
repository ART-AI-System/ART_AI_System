import { Router } from 'express'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import {
  gradeSubmissionController,
  getGradeBySubmissionController,
  deleteGradeController,
  getGradesByGradeItemController,
  getGradesByClassController,
  calculateFinalResultController
} from '~/controllers/grades.controller'

const gradesRouter = Router({ mergeParams: true })

// These will be mounted at /api/submissions/:id/grade
gradesRouter.post('/', requireAuth, requireRole('LECTURER'), gradeSubmissionController)
gradesRouter.get('/', requireAuth, getGradeBySubmissionController)
gradesRouter.put('/', requireAuth, requireRole('LECTURER'), gradeSubmissionController) // PUT and POST map to the same upsert logic
gradesRouter.delete('/', requireAuth, requireRole('LECTURER'), deleteGradeController)

export const gradesStandaloneRouter = Router({ mergeParams: true })

// These will be mounted separately in index.ts
gradesStandaloneRouter.get('/grade-items/:gradeItemId/grades', requireAuth, getGradesByGradeItemController)
gradesStandaloneRouter.get('/classes/:classId/grades', requireAuth, getGradesByClassController)
gradesStandaloneRouter.post('/classes/:classId/students/:studentId/final-result', requireAuth, requireRole('LECTURER'), calculateFinalResultController)

export default gradesRouter
