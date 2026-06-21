import { Router } from 'express'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import {
  createClassController,
  getClassesController,
  getClassByIdController,
  updateClassController,
  deleteClassController,
  importStudentsController
} from '~/controllers/classes.controller'
import { parseImportFile } from '~/middlewares/import.middleware'

const classesRouter = Router()

classesRouter.post('/', requireAuth, requireRole('ADMIN', 'SUBJECT_HEAD'), createClassController)
classesRouter.get('/', requireAuth, getClassesController)
classesRouter.get('/:id', requireAuth, getClassByIdController)
classesRouter.put('/:id', requireAuth, requireRole('ADMIN', 'SUBJECT_HEAD', 'LECTURER'), updateClassController)
classesRouter.delete('/:id', requireAuth, requireRole('ADMIN', 'SUBJECT_HEAD'), deleteClassController)

// Admin imports student list
classesRouter.post('/:id/import', requireAuth, requireRole('ADMIN'), parseImportFile, importStudentsController)

export default classesRouter
