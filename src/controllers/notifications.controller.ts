import { Request, Response, NextFunction } from 'express'
import notificationsService from '~/services/notifications.service'

export const listNotificationsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationsService.listMyNotifications(req.user, req.query as any)
    res.json({
      message: 'Get notifications successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getUnreadCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationsService.getUnreadCount(req.user)
    res.json({
      message: 'Get unread notification count successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const markNotificationReadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationsService.markAsRead(req.params.id as string, req.user)
    res.json({
      message: 'Mark notification as read successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const markAllNotificationsReadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationsService.markAllAsRead(req.user)
    res.json({
      message: 'Mark all notifications as read successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const deleteNotificationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationsService.deleteNotification(req.params.id as string, req.user)
    res.json({
      message: 'Delete notification successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const sendAnnouncementController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationsService.sendAnnouncement(req.body, req.user)
    res.status(201).json({
      message: 'Send announcement successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const listEmailLogsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationsService.listEmailLogs(req.query as any)
    res.json({
      message: 'Get email logs successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getEmailLogController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationsService.getEmailLogById(req.params.id as string)
    res.json({
      message: 'Get email log successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const retryEmailLogController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationsService.retryEmailLog(req.params.id as string)
    res.json({
      message: 'Retry email log successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
