import { Router } from 'express'
import {
  createSubjectController,
  getSubjectByIdController,
  getSubjectsController,
  toggleSubjectStatusController,
  updateSubjectController
} from '~/controllers/subjects.controllers'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { createSubjectValidator, updateSubjectValidator } from '~/models/requests/subjects.request'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const subjectsRouter = Router()

/**
 * Description: List subjects
 * Method: GET
 * Role: All
 */
subjectsRouter.get('/', requireAuth, wrapRequestHandler(getSubjectsController))

/**
 * Description: Get subject detail
 * Method: GET
 * Role: All
 */
subjectsRouter.get('/:id', requireAuth, wrapRequestHandler(getSubjectByIdController))

/**
 * Description: Create subject
 * Method: POST
 * Role: Admin
 */
subjectsRouter.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validate(createSubjectValidator),
  wrapRequestHandler(createSubjectController)
)

/**
 * Description: Update subject
 * Method: PUT
 * Role: Admin
 */
subjectsRouter.put(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(updateSubjectValidator),
  wrapRequestHandler(updateSubjectController)
)

/**
 * Description: Activate/deactivate subject
 * Method: PATCH
 * Role: Admin
 */
subjectsRouter.patch(
  '/:id/status',
  requireAuth,
  requireRole('ADMIN'),
  wrapRequestHandler(toggleSubjectStatusController)
)

export default subjectsRouter
