import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import Notification from '~/models/schemas/notifications.schema'
import EmailLog from '~/models/schemas/emailLogs.schema'
import { ListEmailLogsQuery, ListNotificationsQuery, SendAnnouncementReqBody } from '~/models/requests/notifications.request'

class NotificationsService {
  private toObjectId(id: string, label: string) {
    if (!ObjectId.isValid(id)) {
      throw new ErrorWithStatus({
        message: `Invalid ${label}`,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    return new ObjectId(id)
  }

  private toPagination(query: { page?: string; limit?: string }) {
    const page = Math.max(Number(query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100)
    return {
      page,
      limit,
      skip: (page - 1) * limit
    }
  }

  private async ensureLecturerOwnsClass(user: any, classId: ObjectId) {
    if (user.role !== 'LECTURER') return

    const cls = await databaseService.classes.findOne({
      _id: classId,
      $or: [{ lecturerId: user._id }, { 'lecturer.lecturerId': user._id }]
    })

    if (!cls) {
      throw new ErrorWithStatus({
        message: 'Lecturer is not assigned to this class',
        status: HTTP_STATUS.FORBIDDEN
      })
    }
  }

  private async resolveAnnouncementRecipients(payload: SendAnnouncementReqBody, sender: any) {
    if (payload.recipientIds?.length) {
      const ids = payload.recipientIds.map((id) => this.toObjectId(id, 'recipientId'))
      return databaseService.users
        .find({ _id: { $in: ids }, status: { $ne: 'inactive' } })
        .project({ _id: 1, email: 1, fullName: 1 })
        .toArray()
    }

    if (payload.classId) {
      const classId = this.toObjectId(payload.classId, 'classId')
      await this.ensureLecturerOwnsClass(sender, classId)

      const classMembers = await databaseService.classMembers
        .find({ classId, status: 'active' })
        .project({ studentId: 1, _id: 0 })
        .toArray()
      const studentIds = classMembers.map((member: any) => member.studentId).filter(Boolean)

      return databaseService.users
        .find({ _id: { $in: studentIds }, status: { $ne: 'inactive' } })
        .project({ _id: 1, email: 1, fullName: 1 })
        .toArray()
    }

    const filter: Record<string, unknown> = { status: { $ne: 'inactive' } }
    if (payload.recipientRole) {
      filter.role = payload.recipientRole
    }

    return databaseService.users.find(filter).project({ _id: 1, email: 1, fullName: 1 }).toArray()
  }

  async listMyNotifications(user: any, query: ListNotificationsQuery) {
    const { page, limit, skip } = this.toPagination(query)
    const filter: Record<string, unknown> = { userId: user._id }

    if (query.isRead === 'true') filter.isRead = true
    if (query.isRead === 'false') filter.isRead = false
    if (query.type) filter.type = query.type

    const [notifications, total] = await Promise.all([
      databaseService.notifications.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      databaseService.notifications.countDocuments(filter)
    ])

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getUnreadCount(user: any) {
    const count = await databaseService.notifications.countDocuments({
      userId: user._id,
      isRead: false
    })
    return { unreadCount: count }
  }

  async markAsRead(id: string, user: any) {
    const result = await databaseService.notifications.findOneAndUpdate(
      {
        _id: this.toObjectId(id, 'notificationId'),
        userId: user._id
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'Notification not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return result
  }

  async markAllAsRead(user: any) {
    const now = new Date()
    const result = await databaseService.notifications.updateMany(
      {
        userId: user._id,
        isRead: false
      },
      {
        $set: {
          isRead: true,
          readAt: now,
          updatedAt: now
        }
      }
    )

    return { modifiedCount: result.modifiedCount }
  }

  async deleteNotification(id: string, user: any) {
    const result = await databaseService.notifications.findOneAndDelete({
      _id: this.toObjectId(id, 'notificationId'),
      userId: user._id
    })

    if (!result) {
      throw new ErrorWithStatus({
        message: 'Notification not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return result
  }

  async sendAnnouncement(payload: SendAnnouncementReqBody, sender: any) {
    const title = payload.title?.trim()
    const message = payload.message?.trim()

    if (!title || !message) {
      throw new ErrorWithStatus({
        message: 'Announcement title and message are required',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const recipients = await this.resolveAnnouncementRecipients(payload, sender)
    if (recipients.length === 0) {
      throw new ErrorWithStatus({
        message: 'No recipients found for announcement',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const relatedEntityId = payload.relatedEntityId ? this.toObjectId(payload.relatedEntityId, 'relatedEntityId') : null
    const notifications = recipients.map(
      (recipient: any) =>
        new Notification({
          userId: recipient._id,
          title,
          message,
          type: 'system_announcement',
          relatedEntityType: payload.relatedEntityType || null,
          relatedEntityId,
          createdBy: sender._id
        })
    )

    await databaseService.notifications.insertMany(notifications)

    let emailLogCount = 0
    if (payload.sendEmail) {
      const emailLogs = recipients
        .filter((recipient: any) => recipient.email)
        .map(
          (recipient: any) =>
            new EmailLog({
              to: recipient.email,
              subject: title,
              body: message,
              type: 'system',
              status: 'pending',
              relatedEntityType: payload.relatedEntityType || 'notification',
              relatedEntityId
            })
        )

      if (emailLogs.length > 0) {
        const emailResult = await databaseService.emailLogs.insertMany(emailLogs)
        emailLogCount = emailResult.insertedCount
      }
    }

    return {
      notificationCount: notifications.length,
      emailLogCount
    }
  }

  async listEmailLogs(query: ListEmailLogsQuery) {
    const { page, limit, skip } = this.toPagination(query)
    const filter: Record<string, unknown> = {}

    if (query.status) filter.status = query.status
    if (query.type) filter.type = query.type
    if (query.to) filter.to = query.to.toLowerCase()

    const [emailLogs, total] = await Promise.all([
      databaseService.emailLogs.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      databaseService.emailLogs.countDocuments(filter)
    ])

    return {
      emailLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getEmailLogById(id: string) {
    const emailLog = await databaseService.emailLogs.findOne({ _id: this.toObjectId(id, 'emailLogId') })
    if (!emailLog) {
      throw new ErrorWithStatus({
        message: 'Email log not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return emailLog
  }

  async retryEmailLog(id: string) {
    const emailLog = await this.getEmailLogById(id)
    if (emailLog.status !== 'failed') {
      throw new ErrorWithStatus({
        message: 'Only failed email logs can be retried',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    return databaseService.emailLogs.findOneAndUpdate(
      { _id: emailLog._id },
      {
        $set: {
          status: 'pending',
          errorMessage: '',
          sentAt: null,
          updatedAt: new Date()
        },
        $inc: {
          retryCount: 1
        }
      },
      { returnDocument: 'after' }
    )
  }
}

const notificationsService = new NotificationsService()
export default notificationsService
