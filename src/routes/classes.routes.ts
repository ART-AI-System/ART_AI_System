import { Router } from 'express'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import {
  createClassController,
  getClassesController,
  getClassByIdController,
  updateClassController,
  deleteClassController,
  importStudentsController,
  addStudentToClassController,
  removeStudentFromClassController,
  promoteCohortController
} from '~/controllers/classes.controller'
import {
  getSessionsByClassController,
  createSessionController
} from '~/controllers/sessions.controller'
import { parseImportFile } from '~/middlewares/import.middleware'

const classesRouter = Router()

classesRouter.post('/', requireAuth, requireRole('ADMIN', 'SUBJECT_HEAD'), createClassController)
classesRouter.get('/', requireAuth, getClassesController)
classesRouter.get('/:id', requireAuth, getClassByIdController)
classesRouter.put('/:id', requireAuth, requireRole('ADMIN', 'SUBJECT_HEAD', 'LECTURER'), updateClassController)
classesRouter.delete('/:id', requireAuth, requireRole('ADMIN', 'SUBJECT_HEAD'), deleteClassController)

// Admin imports student list
classesRouter.post('/:id/import', requireAuth, requireRole('ADMIN'), parseImportFile, importStudentsController)

// Admin promotes a cohort to next semester
classesRouter.post('/:id/promote', requireAuth, requireRole('ADMIN'), promoteCohortController)

// Manage individual students
classesRouter.post('/:id/students', requireAuth, requireRole('ADMIN', 'SUBJECT_HEAD', 'LECTURER'), addStudentToClassController)
classesRouter.delete('/:id/students/:studentId', requireAuth, requireRole('ADMIN', 'SUBJECT_HEAD', 'LECTURER'), removeStudentFromClassController)

// Sessions for this class
classesRouter.get('/:classId/sessions', requireAuth, getSessionsByClassController)
classesRouter.post('/:classId/sessions', requireAuth, requireRole('ADMIN', 'LECTURER'), createSessionController)

export default classesRouter
