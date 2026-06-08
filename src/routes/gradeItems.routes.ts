import { Router } from 'express'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import {
  createGradeItemController,
  getGradeItemsByClassController,
  getGradeItemByIdController,
  updateGradeItemController,
  deleteGradeItemController
} from '~/controllers/gradeItems.controller'

const gradeItemsRouter = Router({ mergeParams: true }) // important for nested routes like /classes/:classId/grade-items

// Route matching /api/classes/:classId/grade-items
gradeItemsRouter.post('/', requireAuth, requireRole('LECTURER'), createGradeItemController)
gradeItemsRouter.get('/', requireAuth, getGradeItemsByClassController)

// Route matching /api/grade-items/:id (will be mounted separately)
gradeItemsRouter.get('/standalone/:id', requireAuth, getGradeItemByIdController)
gradeItemsRouter.put('/standalone/:id', requireAuth, requireRole('LECTURER'), updateGradeItemController)
gradeItemsRouter.delete('/standalone/:id', requireAuth, requireRole('LECTURER'), deleteGradeItemController)

export default gradeItemsRouter
