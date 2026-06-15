import { createHash } from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

export function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex')
}

export function hashPassword(password: string): string {
  return sha256(password + process.env.PASSWORD_SECRET)
}

/**
 * Hash một raw token (refresh token hoặc password reset token) trước khi lưu DB.
 * Dùng SHA-256 với PASSWORD_SECRET để ngăn rainbow table attack.
 * Token gốc (raw) dùng để giao tiếp với client; tokenHash lưu DB.
 */
export function hashToken(rawToken: string): string {
  return sha256(rawToken + (process.env.TOKEN_HASH_SECRET || process.env.PASSWORD_SECRET))
}
