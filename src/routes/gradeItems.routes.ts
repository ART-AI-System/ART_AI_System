import { Router } from 'express'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { parseAssignmentMaterialFile } from '~/middlewares/assignments.middleware'
import {
  createGradeItemController,
  getGradeItemsByClassController,
  getGradeItemByIdController,
  updateGradeItemController,
  deleteGradeItemController,
  listGradeItemMaterialsController,
  uploadGradeItemMaterialController,
  downloadGradeItemMaterialController,
  deleteGradeItemMaterialController
} from '~/controllers/gradeItems.controller'
import { wrapRequestHandler } from '~/utils/handlers'

const gradeItemsRouter = Router({ mergeParams: true }) // important for nested routes like /classes/:classId/grade-items

// Route matching /api/classes/:classId/grade-items
gradeItemsRouter.post('/', requireAuth, requireRole('LECTURER'), wrapRequestHandler(createGradeItemController))
gradeItemsRouter.get('/', requireAuth, wrapRequestHandler(getGradeItemsByClassController))

// Route matching /api/grade-items/standalone/:id (will be mounted separately)
gradeItemsRouter.get('/standalone/:id', requireAuth, wrapRequestHandler(getGradeItemByIdController))
gradeItemsRouter.put('/standalone/:id', requireAuth, requireRole('LECTURER'), wrapRequestHandler(updateGradeItemController))
gradeItemsRouter.delete('/standalone/:id', requireAuth, requireRole('LECTURER'), wrapRequestHandler(deleteGradeItemController))

// Material Routes
gradeItemsRouter.get('/standalone/:id/materials', requireAuth, wrapRequestHandler(listGradeItemMaterialsController))
gradeItemsRouter.post(
  '/standalone/:id/materials',
  requireAuth,
  requireRole('LECTURER'),
  parseAssignmentMaterialFile,
  wrapRequestHandler(uploadGradeItemMaterialController)
)
gradeItemsRouter.get('/materials/:materialId/download', requireAuth, wrapRequestHandler(downloadGradeItemMaterialController))
gradeItemsRouter.delete(
  '/materials/:materialId',
  requireAuth,
  requireRole('LECTURER'),
  wrapRequestHandler(deleteGradeItemMaterialController)
)

export default gradeItemsRouter
