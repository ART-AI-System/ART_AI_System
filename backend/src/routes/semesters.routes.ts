import { Router } from 'express'
import {
  createSemesterController,
  getCurrentSemesterController,
  getSemesterByIdController,
  getSemestersController,
  setCurrentSemesterController,
  toggleSemesterStatusController,
  updateSemesterController
} from '~/controllers/semesters.controllers'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { createSemesterValidator, updateSemesterValidator } from '~/models/requests/semesters.request'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const semestersRouter = Router()

/**
 * Description: List semesters
 * Method: GET
 * Role: All
 */
semestersRouter.get('/', requireAuth, wrapRequestHandler(getSemestersController))

/**
 * Description: Get current semester
 * Method: GET
 * Role: All
 */
semestersRouter.get('/current', requireAuth, wrapRequestHandler(getCurrentSemesterController))

/**
 * Description: Get semester detail
 * Method: GET
 * Role: All
 */
semestersRouter.get('/:id', requireAuth, wrapRequestHandler(getSemesterByIdController))

/**
 * Description: Create semester
 * Method: POST
 * Role: Admin
 */
semestersRouter.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validate(createSemesterValidator),
  wrapRequestHandler(createSemesterController)
)

/**
 * Description: Update semester
 * Method: PUT
 * Role: Admin
 */
semestersRouter.put(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(updateSemesterValidator),
  wrapRequestHandler(updateSemesterController)
)

/**
 * Description: Set current semester
 * Method: PATCH
 * Role: Admin
 */
semestersRouter.patch(
  '/:id/current',
  requireAuth,
  requireRole('ADMIN'),
  wrapRequestHandler(setCurrentSemesterController)
)

/**
 * Description: Activate/deactivate semester
 * Method: PATCH
 * Role: Admin
 */
semestersRouter.patch(
  '/:id/status',
  requireAuth,
  requireRole('ADMIN'),
  wrapRequestHandler(toggleSemesterStatusController)
)

export default semestersRouter
