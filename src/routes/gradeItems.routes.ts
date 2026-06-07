import { Router } from 'express'
import {
  createGradeItemController,
  getGradeItemsByClassController,
  getGradeItemByIdController,
  updateGradeItemController,
  deleteGradeItemController
} from '~/controllers/gradeItems.controller'

const gradeItemsRouter = Router({ mergeParams: true }) // important for nested routes like /classes/:classId/grade-items

// Route matching /api/classes/:classId/grade-items
gradeItemsRouter.post('/', createGradeItemController)
gradeItemsRouter.get('/', getGradeItemsByClassController)

// Route matching /api/grade-items/:id (will be mounted separately)
gradeItemsRouter.get('/standalone/:id', getGradeItemByIdController)
gradeItemsRouter.put('/standalone/:id', updateGradeItemController)
gradeItemsRouter.delete('/standalone/:id', deleteGradeItemController)

export default gradeItemsRouter
