import { Router } from 'express'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import {
  getAdminDashboardController,
  getSystemActivityController
} from '~/controllers/admin.controllers'

const adminRouter = Router()

adminRouter.use(requireAuth, requireRole('ADMIN'))

adminRouter.get('/dashboard', getAdminDashboardController)
adminRouter.get('/system-activity', getSystemActivityController)

export default adminRouter
