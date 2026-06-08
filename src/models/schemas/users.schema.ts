import { ObjectId } from "mongodb"
import { UserVerifyStatus } from "~/constants/enums"

export type UserRole = 'STUDENT' | 'LECTURER' | 'SUBJECT_HEAD' | 'ADMIN'

export interface UserType {
  _id?: ObjectId
  email: string
  password: string
  fullName: string
  studentCode?: string | null
  role?: UserRole
  isActive?: boolean
  // Flexible profile object for optional metadata (bio, avatar, etc.)
  profile?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
}

export default class User {
  _id?: ObjectId
  email!: string
  password!: string
  fullName!: string
  studentCode!: string | null
  role!: UserRole
  isActive!: boolean
  profile!: Record<string, any>
  createdAt!: Date
  updatedAt!: Date
  // Module 1 auth fields — kept for backward compatibility
  email_verify_token!: string
  forgot_password_token!: string
  verify!: UserVerifyStatus

  constructor(user: UserType) {
    const date = new Date()
    Object.assign(this, user)
    this.role = user.role || 'STUDENT'
    this.studentCode = user.studentCode ?? null
    this.isActive = user.isActive ?? true
    this.profile = user.profile ?? {}
    this.createdAt = user.createdAt || date
    this.updatedAt = user.updatedAt || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify ?? UserVerifyStatus.UNVERIFIED
  }
}