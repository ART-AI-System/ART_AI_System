import { ObjectId } from 'mongodb'

export type NotificationType =
  | 'assignment_created'
  | 'assignment_published'
  | 'assignment_updated'
  | 'deadline_reminder'
  | 'submission_success'
  | 'submission_reviewed'
  | 'grade_published'
  | 'flag_created'
  | 'final_result_released'
  | 'chat_message'
  | 'system_announcement'

export interface NotificationSchemaType {
  _id?: ObjectId
  userId: ObjectId
  title: string
  message: string
  type: NotificationType
  relatedEntityType?: string | null
  relatedEntityId?: ObjectId | null
  isRead?: boolean
  readAt?: Date | null
  createdBy?: ObjectId | null
  createdAt?: Date
  updatedAt?: Date
}

export default class Notification {
  [key: string]: any
  _id?: ObjectId
  userId: ObjectId
  title: string
  message: string
  type: NotificationType
  relatedEntityType: string | null
  relatedEntityId: ObjectId | null
  isRead: boolean
  readAt: Date | null
  createdBy: ObjectId | null
  createdAt: Date
  updatedAt: Date

  constructor(data: NotificationSchemaType) {
    const date = new Date()
    this._id = data._id
    this.userId = data.userId
    this.title = data.title
    this.message = data.message
    this.type = data.type
    this.relatedEntityType = data.relatedEntityType ?? null
    this.relatedEntityId = data.relatedEntityId ?? null
    this.isRead = data.isRead ?? false
    this.readAt = data.readAt ?? null
    this.createdBy = data.createdBy ?? null
    this.createdAt = data.createdAt || date
    this.updatedAt = data.updatedAt || date
  }
}
