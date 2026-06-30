import { Router } from 'express'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import {
  deleteNotificationController,
  getEmailLogController,
  getUnreadCountController,
  listEmailLogsController,
  listNotificationsController,
  markAllNotificationsReadController,
  markNotificationReadController,
  retryEmailLogController,
  sendAnnouncementController
} from '~/controllers/notifications.controller'

const notificationsRouter = Router()

notificationsRouter.get('/notifications', requireAuth, wrapRequestHandler(listNotificationsController))
notificationsRouter.get('/notifications/unread-count', requireAuth, wrapRequestHandler(getUnreadCountController))
notificationsRouter.patch('/notifications/:id/read', requireAuth, wrapRequestHandler(markNotificationReadController))
notificationsRouter.patch('/notifications/read-all', requireAuth, wrapRequestHandler(markAllNotificationsReadController))
notificationsRouter.delete('/notifications/:id', requireAuth, wrapRequestHandler(deleteNotificationController))
notificationsRouter.post(
  '/notifications/announcements',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD', 'ADMIN'),
  wrapRequestHandler(sendAnnouncementController)
)

notificationsRouter.get('/email-logs', requireAuth, requireRole('ADMIN'), wrapRequestHandler(listEmailLogsController))
notificationsRouter.get('/email-logs/:id', requireAuth, requireRole('ADMIN'), wrapRequestHandler(getEmailLogController))
notificationsRouter.post(
  '/email-logs/:id/retry',
  requireAuth,
  requireRole('ADMIN'),
  wrapRequestHandler(retryEmailLogController)
)

export default notificationsRouter
