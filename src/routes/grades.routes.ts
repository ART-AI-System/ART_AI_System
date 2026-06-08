import { Router } from 'express'
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
gradesRouter.post('/', gradeSubmissionController)
gradesRouter.get('/', getGradeBySubmissionController)
gradesRouter.put('/', gradeSubmissionController) // PUT and POST map to the same upsert logic
gradesRouter.delete('/', deleteGradeController)

export const gradesStandaloneRouter = Router({ mergeParams: true })

// These will be mounted separately in index.ts
gradesStandaloneRouter.get('/grade-items/:gradeItemId/grades', getGradesByGradeItemController)
gradesStandaloneRouter.get('/classes/:classId/grades', getGradesByClassController)
gradesStandaloneRouter.post('/classes/:classId/students/:studentId/final-result', calculateFinalResultController)

export default gradesRouter
