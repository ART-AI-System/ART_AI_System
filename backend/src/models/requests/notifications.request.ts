import { NotificationType } from '~/models/schemas/notifications.schema'

export interface SendAnnouncementReqBody {
  title: string
  message: string
  recipientIds?: string[]
  recipientRole?: 'STUDENT' | 'LECTURER' | 'SUBJECT_HEAD' | 'ADMIN'
  classId?: string
  sendEmail?: boolean
  relatedEntityType?: string
  relatedEntityId?: string
}

export interface ListNotificationsQuery {
  page?: string
  limit?: string
  isRead?: string
  type?: NotificationType
}

export interface ListEmailLogsQuery {
  page?: string
  limit?: string
  status?: string
  type?: string
  to?: string
}
