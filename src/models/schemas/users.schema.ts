import { ObjectId } from 'mongodb'
import { UserStatus } from '~/constants/enums'

// ==========================================
// User Schema Types - ART-AI System
// ==========================================
// Quy tắc:
//   - role: UPPERCASE (STUDENT, LECTURER, SUBJECT_HEAD, ADMIN) — lưu DB
//   - status: lowercase enum (active, inactive, pending_activation) — theo spec
//   - passwordHash: hash của password (SHA-256 + secret) — không bao giờ expose
//   - username: dành cho staff (lecturer/subject_head/admin); student dùng studentCode
//   - studentCode: dành cho student; staff không bắt buộc
//   - isActive: giữ lại để backward compat với auth.middlewares.ts (phản ánh status)
// ==========================================

export type UserRoleType = 'STUDENT' | 'LECTURER' | 'SUBJECT_HEAD' | 'ADMIN'

// Backward compat alias — classes.schema.ts và một số module cũ import UserRole từ đây
export type UserRole = UserRoleType

export interface UserType {
  _id?: ObjectId
  uuid?: string
  email: string
  username?: string | null
  passwordHash: string
  // backward compat alias — một số module cũ dùng password thay vì passwordHash
  password?: string
  fullName: string
  studentCode?: string | null
  role?: UserRoleType
  status?: UserStatus | string
  // isActive giữ lại để không phá code cũ trong auth.middlewares.ts
  isActive?: boolean
  isAutoProvisioned?: boolean
  departmentId?: ObjectId | null
  lastLoginAt?: Date | null
  profile?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

export default class User {
  _id?: ObjectId
  uuid: string
  email: string
  username?: string
  passwordHash: string
  fullName: string
  studentCode?: string
  role: UserRoleType
  status: string
  isActive: boolean
  isAutoProvisioned: boolean
  departmentId: ObjectId | null
  lastLoginAt: Date | null
  profile: Record<string, any>
  createdAt: Date
  updatedAt: Date

  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id
    this.uuid = user.uuid || new ObjectId().toHexString()
    this.email = user.email
    if (user.username) this.username = user.username
    // Ưu tiên passwordHash; fallback sang password nếu code cũ truyền vào
    this.passwordHash = user.passwordHash || user.password || ''
    this.fullName = user.fullName
    if (user.studentCode) this.studentCode = user.studentCode
    this.role = user.role || 'STUDENT'
    this.status = user.status || UserStatus.ACTIVE
    // isActive phản ánh status để backward compat
    this.isActive = user.isActive !== undefined ? user.isActive : this.status !== UserStatus.INACTIVE
    this.isAutoProvisioned = user.isAutoProvisioned ?? false
    this.departmentId = user.departmentId ?? null
    this.lastLoginAt = user.lastLoginAt ?? null
    this.profile = user.profile ?? {}
    this.createdAt = user.createdAt || date
    this.updatedAt = user.updatedAt || date
  }
}