import { ObjectId } from 'mongodb'
import { randomBytes } from 'crypto'
import type { StringValue } from 'ms'
import { TokenType, UserStatus } from '~/constants/enums'
import { hashPassword, hashToken } from '~/constants/crypto'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import PasswordResetToken from '~/models/schemas/passwordResetToken.schema'
import User from '~/models/schemas/users.schema'
import databaseService from '~/services/database.service'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenPayload, RegisterStudentReqBody } from '~/models/requests/users.request'
import { UserRoleType } from '~/models/schemas/users.schema'
import dotenv from 'dotenv'
dotenv.config()

// ==========================================
// AuthService — xử lý toàn bộ business logic xác thực ART-AI
//
// Nguyên tắc:
//   - Không truy cập HTTP layer (req/res)
//   - Refresh token lưu theo tokenHash (SHA-256), không lưu raw token
//   - PasswordResetToken lưu theo tokenHash
//   - Token Rotation: immutable expiry (refresh token mới giữ nguyên exp)
//   - Secret keys đọc từ process.env
// ==========================================

class AuthService {
  // ==========================================
  // PRIVATE: Token signing helpers
  // ==========================================

  /**
   * Ký Access Token.
   * Payload: { user_id, token_type: ACCESS_TOKEN, role }
   */
  private signAccessToken({ user_id, role }: { user_id: string; role: UserRoleType }): Promise<string> {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ACCESS_TOKEN,
        role
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  /**
   * Ký Refresh Token.
   * Hai chế độ:
   *   1. Ký mới: dùng expiresIn từ env
   *   2. Rotate: truyền exp cũ để giữ nguyên expiry (Immutable Rotation)
   */
  private signRefreshToken({
    user_id,
    role,
    exp
  }: {
    user_id: string
    role: UserRoleType
    exp?: number
  }): Promise<string> {
    if (exp !== undefined) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.REFRESH_TOKEN,
          role,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }

    return signToken({
      payload: {
        user_id,
        token_type: TokenType.REFRESH_TOKEN,
        role
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  /**
   * Ký đồng thời [Access Token, Refresh Token] song song.
   */
  private signAccessAndRefreshToken({
    user_id,
    role
  }: {
    user_id: string
    role: UserRoleType
  }): Promise<[string, string]> {
    return Promise.all([
      this.signAccessToken({ user_id, role }),
      this.signRefreshToken({ user_id, role })
    ])
  }

  /**
   * Giải mã Refresh Token để lấy payload (iat, exp).
   */
  private decodeRefreshToken(refresh_token: string): Promise<TokenPayload> {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  // ==========================================
  // PUBLIC: Business Logic Methods
  // ==========================================

  /**
   * Đăng ký student mới.
   * - Kiểm tra duplicate email và studentCode
   * - Hash password, tạo User với role=STUDENT, status=active
   * - Trả về user object (không có passwordHash)
   */
  async registerStudent(body: RegisterStudentReqBody): Promise<{
    id: string
    studentCode: string
    fullName: string
    email: string
    role: string
  }> {
    const { studentCode, fullName, email, password } = body

    // Kiểm tra email duplicate
    const emailExists = await databaseService.users.findOne({ email: email.toLowerCase() })
    if (emailExists) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_ALREADY_IN_USE,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    // Kiểm tra studentCode duplicate
    const codeExists = await databaseService.users.findOne({ studentCode })
    if (codeExists) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.STUDENT_CODE_ALREADY_IN_USE,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    const user = new User({
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      fullName,
      studentCode,
      role: 'STUDENT',
      status: UserStatus.ACTIVE,
      isActive: true
    })

    const result = await databaseService.users.insertOne(user)

    return {
      id: result.insertedId.toString(),
      studentCode: studentCode,
      fullName,
      email: email.toLowerCase(),
      role: 'student' // map sang lowercase cho response FE
    }
  }

  /**
   * Login — sinh token pair và lưu tokenHash vào DB.
   *
   * @param user_id  - ObjectId string của user đã được xác thực
   * @param role     - UserRole của user
   * @param req      - Express request (optional, dùng lấy userAgent/ip)
   */
  async login({
    user_id,
    role,
    userAgent = '',
    ipAddress = ''
  }: {
    user_id: string
    role: UserRoleType
    userAgent?: string
    ipAddress?: string
  }): Promise<{
    access_token: string
    refresh_token: string
  }> {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({ user_id, role })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    // Lưu tokenHash thay vì raw token
    const tokenHash = hashToken(refresh_token)

    await Promise.all([
      databaseService.refreshTokens.insertOne(
        new RefreshToken({
          userId: new ObjectId(user_id),
          tokenHash,
          expiresAt: new Date(exp * 1000),
          iat,
          userAgent,
          ipAddress
        })
      ),
      // Cập nhật lastLoginAt
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        { $set: { lastLoginAt: new Date() } }
      )
    ])

    return { access_token, refresh_token }
  }

  /**
   * Logout — revoke refresh token (xóa tokenHash khỏi DB).
   */
  async logout(refresh_token: string): Promise<{ message: string }> {
    const tokenHash = hashToken(refresh_token)
    await databaseService.refreshTokens.deleteOne({ tokenHash })

    return { message: USERS_MESSAGES.LOGOUT_SUCCESSFUL }
  }

  /**
   * Refresh Token Rotation (Immutable).
   *   - Ký access token mới
   *   - Ký refresh token mới với exp cũ (không kéo dài session)
   *   - Revoke token cũ, lưu token mới (theo tokenHash)
   */
  async refreshToken({
    user_id,
    role,
    refresh_token,
    exp
  }: {
    user_id: string
    role: UserRoleType
    refresh_token: string
    exp: number
  }): Promise<{ access_token: string; refresh_token: string }> {
    const old_token_hash = hashToken(refresh_token)

    const [[new_access_token, new_refresh_token]] = await Promise.all([
      Promise.all([
        this.signAccessToken({ user_id, role }),
        this.signRefreshToken({ user_id, role, exp })
      ]),
      databaseService.refreshTokens.deleteOne({ tokenHash: old_token_hash })
    ])

    const decoded_old = await this.decodeRefreshToken(refresh_token)
    const new_token_hash = hashToken(new_refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        userId: new ObjectId(user_id),
        tokenHash: new_token_hash,
        expiresAt: new Date(decoded_old.exp * 1000),
        iat: decoded_old.iat
      })
    )

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  /**
   * Forgot Password — sinh reset token, lưu hash, chuẩn bị gửi email.
   *
   * Bảo mật: Luôn trả về cùng message dù email tồn tại hay không
   * (ngăn email enumeration attack).
   *
   * DEV MODE: Log raw token ra console.
   * PROD MODE: Gửi qua email service (placeholder).
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await databaseService.users.findOne({ email: email.toLowerCase() })

    // Không reveal thông tin về email có tồn tại không
    if (!user) {
      return { message: USERS_MESSAGES.FORGOT_PASSWORD_SUCCESSFUL }
    }

    // Sinh random reset token (32 bytes = 64 hex chars)
    const rawToken = randomBytes(32).toString('hex')
    const tokenHash = hashToken(rawToken)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 giờ

    // Xóa các token cũ của user này (chỉ giữ 1 token active)
    await databaseService.passwordResetTokens.deleteMany({ userId: user._id })

    await databaseService.passwordResetTokens.insertOne(
      new PasswordResetToken({
        userId: user._id as ObjectId,
        tokenHash,
        expiresAt
      })
    )

    // TODO: Tích hợp email service khi sẵn sàng
    // Hiện tại log ra console trong dev mode
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DEV] Password Reset Token:', rawToken)
      console.log('[DEV] Reset URL: /auth/reset-password?token=' + rawToken)
    }

    // Placeholder: gửi email service
    // await emailService.sendPasswordReset({ to: email, token: rawToken, expiresAt })

    return { message: USERS_MESSAGES.FORGOT_PASSWORD_SUCCESSFUL }
  }

  /**
   * Reset Password — verify token, đổi password, đánh dấu token đã dùng.
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const tokenHash = hashToken(token)
    const resetToken = await databaseService.passwordResetTokens.findOne({ tokenHash })

    if (!resetToken) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.RESET_TOKEN_IS_INVALID,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (resetToken.usedAt) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.RESET_TOKEN_ALREADY_USED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (resetToken.expiresAt < new Date()) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.RESET_TOKEN_EXPIRED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const newPasswordHash = hashPassword(newPassword)

    // Cập nhật password và đánh dấu token đã dùng (parallel)
    await Promise.all([
      databaseService.users.updateOne(
        { _id: resetToken.userId },
        { $set: { passwordHash: newPasswordHash, updatedAt: new Date() } }
      ),
      databaseService.passwordResetTokens.updateOne(
        { _id: resetToken._id },
        { $set: { usedAt: new Date() } }
      )
    ])

    return { message: USERS_MESSAGES.RESET_PASSWORD_SUCCESSFUL }
  }

  /**
   * Change Password — xác thực old password, cập nhật new password.
   * Yêu cầu user đã đăng nhập.
   */
  async changePassword(
    user_id: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const oldPasswordHash = hashPassword(oldPassword)

    // So sánh với passwordHash trong DB
    // Backward compat: nếu DB còn dùng field 'password' thì check cả hai
    const storedHash = (user as any).passwordHash || (user as any).password
    if (storedHash !== oldPasswordHash) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.OLD_PASSWORD_IS_INCORRECT,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // New password phải khác old password
    const newPasswordHash = hashPassword(newPassword)
    if (newPasswordHash === oldPasswordHash) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.NEW_PASSWORD_SAME_AS_OLD,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { passwordHash: newPasswordHash, updatedAt: new Date() } }
    )

    return { message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESSFUL }
  }

  /**
   * Tìm student theo studentCode + password.
   * Dùng bởi loginValidator (student flow).
   */
  async findStudentByCodeAndPassword(
    studentCode: string,
    password: string
  ): Promise<InstanceType<typeof User> | null> {
    const passwordHash = hashPassword(password)

    const user = await databaseService.users.findOne({
      studentCode,
      $or: [
        { passwordHash },
        { password: passwordHash } // backward compat
      ]
    })

    return user as InstanceType<typeof User> | null
  }

  /**
   * Tìm staff theo username + password.
   * Dùng bởi loginValidator (staff flow).
   */
  async findStaffByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<InstanceType<typeof User> | null> {
    const passwordHash = hashPassword(password)

    const user = await databaseService.users.findOne({
      username,
      $or: [
        { passwordHash },
        { password: passwordHash } // backward compat
      ]
    })

    return user as InstanceType<typeof User> | null
  }

  /**
   * Kiểm tra email có tồn tại trong hệ thống không.
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const user = await databaseService.users.findOne({ email: email.toLowerCase() })
    return Boolean(user)
  }

  /**
   * @deprecated Dùng findStudentByCodeAndPassword hoặc findStaffByUsernameAndPassword
   * Giữ lại để backward compat với một số module cũ.
   */
  async findUserByEmailAndPassword(email: string, password: string) {
    const user = await databaseService.users.findOne({
      email,
      $or: [
        { passwordHash: hashPassword(password) },
        { password: hashPassword(password) }
      ]
    })

    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    return user
  }
}

const authService = new AuthService()
export default authService
