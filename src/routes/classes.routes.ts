import { Router } from 'express'
import {
  createClassController,
  getClassesController,
  getClassByIdController,
  updateClassController,
  deleteClassController
} from '~/controllers/classes.controller'

const classesRouter = Router()

classesRouter.post('/', createClassController)
classesRouter.get('/', getClassesController)
classesRouter.get('/:id', getClassByIdController)
classesRouter.put('/:id', updateClassController)
classesRouter.delete('/:id', deleteClassController)

export default classesRouter
