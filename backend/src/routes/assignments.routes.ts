import { Router } from 'express'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { parseAssignmentMaterialFile } from '~/middlewares/assignments.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import {
  closeAssignmentController,
  createAssignmentController,
  deleteAssignmentController,
  deleteAssignmentMaterialController,
  downloadAssignmentMaterialController,
  getAssignmentController,
  listAssignmentMaterialsController,
  listClassAssignmentsController,
  listSessionAssignmentsController,
  publishAssignmentController,
  updateAssignmentController,
  uploadAssignmentMaterialController
} from '~/controllers/assignments.controller'

const assignmentsRouter = Router()

assignmentsRouter.get('/classes/:classId/assignments', requireAuth, wrapRequestHandler(listClassAssignmentsController))

assignmentsRouter.get('/sessions/:sessionId/assignments', requireAuth, wrapRequestHandler(listSessionAssignmentsController))
assignmentsRouter.post(
  '/sessions/:sessionId/assignments',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(createAssignmentController)
)

assignmentsRouter.get('/assignments/:id', requireAuth, wrapRequestHandler(getAssignmentController))
assignmentsRouter.put(
  '/assignments/:id',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(updateAssignmentController)
)
assignmentsRouter.delete(
  '/assignments/:id',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(deleteAssignmentController)
)
assignmentsRouter.patch(
  '/assignments/:id/publish',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(publishAssignmentController)
)
assignmentsRouter.patch(
  '/assignments/:id/close',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(closeAssignmentController)
)

assignmentsRouter.get(
  '/assignments/:assignmentId/materials',
  requireAuth,
  wrapRequestHandler(listAssignmentMaterialsController)
)
assignmentsRouter.post(
  '/assignments/:assignmentId/materials',
  requireAuth,
  requireRole('LECTURER'),
  parseAssignmentMaterialFile,
  wrapRequestHandler(uploadAssignmentMaterialController)
)
assignmentsRouter.get('/materials/:id/download', requireAuth, wrapRequestHandler(downloadAssignmentMaterialController))
assignmentsRouter.delete(
  '/materials/:id',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(deleteAssignmentMaterialController)
)

export default assignmentsRouter
