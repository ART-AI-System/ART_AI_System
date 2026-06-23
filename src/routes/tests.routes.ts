import { Router } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import {
  createTestController,
  deleteTestController,
  getAttemptResultController,
  getTestAnalyticsController,
  getTestForLecturerController,
  getTestForStudentController,
  getTestsByClassController,
  overrideScoreController,
  exportGradesController,
  reportCheatController,
  startAttemptController,
  submitAttemptController
} from '~/controllers/tests.controllers'

const testsRouter = Router()

// LECTURER
testsRouter.post('/classes/:classId/tests', requireAuth, requireRole('LECTURER'), wrapRequestHandler(createTestController))
testsRouter.get('/classes/:classId/tests', requireAuth, wrapRequestHandler(getTestsByClassController)) // Can be both, let controllers/service filter? Or keep generic.
testsRouter.get('/tests/:testId/lecturer', requireAuth, requireRole('LECTURER'), wrapRequestHandler(getTestForLecturerController))
testsRouter.delete('/tests/:testId', requireAuth, requireRole('LECTURER'), wrapRequestHandler(deleteTestController))
testsRouter.get('/tests/:testId/analytics', requireAuth, requireRole('LECTURER'), wrapRequestHandler(getTestAnalyticsController))
testsRouter.patch('/test-attempts/:attemptId/override-score', requireAuth, requireRole('LECTURER'), wrapRequestHandler(overrideScoreController))
testsRouter.post('/tests/:testId/export-grades', requireAuth, requireRole('LECTURER'), wrapRequestHandler(exportGradesController))

// STUDENT
testsRouter.get('/tests/:testId/take', requireAuth, requireRole('STUDENT'), wrapRequestHandler(getTestForStudentController))
testsRouter.post('/tests/:testId/start', requireAuth, requireRole('STUDENT'), wrapRequestHandler(startAttemptController))
testsRouter.patch('/test-attempts/:attemptId/cheat', requireAuth, requireRole('STUDENT'), wrapRequestHandler(reportCheatController))
testsRouter.post('/test-attempts/:attemptId/submit', requireAuth, requireRole('STUDENT'), wrapRequestHandler(submitAttemptController))
testsRouter.get('/test-attempts/:attemptId/result', requireAuth, requireRole('STUDENT'), wrapRequestHandler(getAttemptResultController))

export default testsRouter
