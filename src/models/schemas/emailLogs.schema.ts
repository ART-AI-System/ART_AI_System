import { ObjectId } from 'mongodb'

export type EmailLogType =
  | 'assignment_created'
  | 'assignment_published'
  | 'deadline_reminder'
  | 'submission_success'
  | 'grade_published'
  | 'password_reset'
  | 'system'

export type EmailLogStatus = 'pending' | 'queued' | 'sent' | 'failed'

export interface EmailLogSchemaType {
  _id?: ObjectId
  to: string
  subject: string
  body: string
  type: EmailLogType
  status?: EmailLogStatus
  errorMessage?: string
  sentAt?: Date | null
  relatedEntityType?: string | null
  relatedEntityId?: ObjectId | null
  retryCount?: number
  createdAt?: Date
  updatedAt?: Date
}

export default class EmailLog {
  [key: string]: any
  _id?: ObjectId
  to: string
  subject: string
  body: string
  type: EmailLogType
  status: EmailLogStatus
  errorMessage: string
  sentAt: Date | null
  relatedEntityType: string | null
  relatedEntityId: ObjectId | null
  retryCount: number
  createdAt: Date
  updatedAt: Date

  constructor(data: EmailLogSchemaType) {
    const date = new Date()
    this._id = data._id
    this.to = data.to.trim().toLowerCase()
    this.subject = data.subject
    this.body = data.body
    this.type = data.type
    this.status = data.status || 'pending'
    this.errorMessage = data.errorMessage || ''
    this.sentAt = data.sentAt ?? null
    this.relatedEntityType = data.relatedEntityType ?? null
    this.relatedEntityId = data.relatedEntityId ?? null
    this.retryCount = data.retryCount ?? 0
    this.createdAt = data.createdAt || date
    this.updatedAt = data.updatedAt || date
  }
}
