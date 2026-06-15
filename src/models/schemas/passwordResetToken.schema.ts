import { ObjectId } from 'mongodb'

// ==========================================
// PasswordResetToken Schema - ART-AI System
// ==========================================
// Dùng cho flow: Forgot Password → Reset Password
//
// Bảo mật:
//   - Không lưu raw token — chỉ lưu tokenHash (SHA-256)
//   - Raw token gửi qua email hoặc log console (dev mode)
//   - Sau khi sử dụng, đánh dấu usedAt để prevent replay attack
//   - TTL index trên expiresAt để tự động xóa token hết hạn
// ==========================================

interface PasswordResetTokenType {
  _id?: ObjectId
  userId: ObjectId
  tokenHash: string    // SHA-256 hash của raw reset token
  expiresAt: Date      // Thời điểm hết hạn (thường 1 giờ từ lúc tạo)
  usedAt?: Date | null // null = chưa dùng; Date = đã dùng (revoked)
}

export default class PasswordResetToken {
  _id?: ObjectId
  userId: ObjectId
  tokenHash: string
  expiresAt: Date
  usedAt: Date | null

  constructor({ _id, userId, tokenHash, expiresAt, usedAt }: PasswordResetTokenType) {
    this._id = _id
    this.userId = userId
    this.tokenHash = tokenHash
    this.expiresAt = expiresAt
    this.usedAt = usedAt ?? null
  }
}
