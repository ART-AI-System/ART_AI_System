import { ObjectId } from 'mongodb'

// ==========================================
// RefreshToken Schema - ART-AI System
// ==========================================
// Thay đổi so với version cũ:
//   - token   → tokenHash (SHA-256 hash của raw token)
//   - user_id → userId (naming convention theo spec)
//   - iat/exp → giữ lại nhưng chuyển sang expiresAt cho TTL index
//   - Thêm userAgent, ipAddress (optional, phục vụ audit trail)
// ==========================================

interface RefreshTokenType {
  _id?: ObjectId
  userId: ObjectId
  tokenHash: string    // SHA-256 hash của raw refresh token — không lưu raw
  expiresAt: Date      // Dùng cho TTL index MongoDB
  iat?: number         // Issued at (epoch seconds) — từ JWT payload
  userAgent?: string
  ipAddress?: string
}

export default class RefreshToken {
  _id?: ObjectId
  userId: ObjectId
  tokenHash: string
  expiresAt: Date
  iat: Date
  userAgent: string
  ipAddress: string

  constructor({ _id, userId, tokenHash, expiresAt, iat, userAgent, ipAddress }: RefreshTokenType) {
    this._id = _id
    this.userId = userId
    this.tokenHash = tokenHash
    this.expiresAt = expiresAt
    this.iat = iat ? new Date(iat * 1000) : new Date()
    this.userAgent = userAgent || ''
    this.ipAddress = ipAddress || ''
  }
}
