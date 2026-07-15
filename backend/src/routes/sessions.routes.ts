import { Router } from 'express'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import {
  getSessionByIdController,
  updateSessionController,
  deleteSessionController
} from '~/controllers/sessions.controller'

const sessionsRouter = Router()

sessionsRouter.get('/:id', requireAuth, getSessionByIdController)
sessionsRouter.put('/:id', requireAuth, requireRole('LECTURER', 'ADMIN'), updateSessionController)
sessionsRouter.delete('/:id', requireAuth, requireRole('LECTURER', 'ADMIN'), deleteSessionController)

export default sessionsRouter
