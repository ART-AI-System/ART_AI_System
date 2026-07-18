import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  RegisterStudentReqBody,
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  ForgotPasswordReqBody,
  ResetPasswordReqBody,
  ChangePasswordReqBody,
  TokenPayload
} from '~/models/requests/users.request'
import User from '~/models/schemas/users.schema'
import authService from '~/services/auth.services'

// ==========================================
// Auth Controllers — ART-AI System
//
// Thin Controllers: KHÔNG chứa business logic, KHÔNG truy vấn DB trực tiếp.
// Nhiệm vụ:
//   1. Bóc tách payload từ req (body, params, decoded tokens).
//   2. Gọi đúng method của authService.
//   3. Trả về response HTTP chuẩn với status code và message.
//
// Tất cả function được bọc bởi wrapRequestHandler() ở tầng Route
// để tự động bắt lỗi async và chuyển lên defaultErrorHandler.
// Vì vậy, controller KHÔNG cần try-catch.
// ==========================================

/**
 * Đăng ký tài khoản sinh viên mới.
 *
 * Precondition:
 *   - registerStudentValidator đã validate studentCode, fullName, email, password.
 *
 * @route  POST /api/auth/register/student
 * @access Public
 */
export const registerStudentController = async (
  req: Request<ParamsDictionary, any, RegisterStudentReqBody>,
  res: Response
): Promise<void> => {
  const result = await authService.registerStudent(req.body)

  res.status(HTTP_STATUS.CREATED).json({
    message: USERS_MESSAGES.REGISTER_STUDENT_SUCCESSFUL,
    result
  })
}

/**
 * Đăng nhập.
 *
 * Precondition:
 *   - loginValidator đã xác thực credentials (studentCode/username + password).
 *   - loginValidator đã gắn req.user = User document.
 *
 * Luồng:
 *   1. Đọc user từ req.user.
 *   2. Gọi authService.login() để ký token pair và lưu tokenHash vào DB.
 *   3. Trả về 200 OK với { access_token, refresh_token, user }.
 *
 * @route  POST /api/auth/login
 * @access Public
 */
export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response
): Promise<void> => {
  const user = req.user as User
  const user_id = (user._id as ObjectId).toString()
  const role = user.role || 'STUDENT'

  const userAgent = req.headers['user-agent'] || ''
  const ipAddress = req.ip || ''

  const { access_token, refresh_token } = await authService.login({
    user_id,
    role,
    userAgent,
    ipAddress
  })

  // Map role sang lowercase cho response FE
  const roleLower = role.toLowerCase()

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESSFUL,
    result: {
      access_token,
      refresh_token,
      user: {
        id: user_id,
        email: user.email,
        fullName: user.fullName,
        role: roleLower,
        studentCode: user.studentCode || undefined,
        username: user.username || undefined,
        status: user.status
      }
    }
  })
}

/**
 * Refresh Token — Immutable Rotation.
 *
 * Precondition:
 *   - refreshTokenValidator đã xác thực refresh_token hợp lệ (JWT + DB lookup tokenHash).
 *   - refreshTokenValidator đã gắn req.decored_refresh_token = decoded payload.
 *
 * Luồng:
 *   1. Đọc refresh_token từ req.body.
 *   2. Đọc { user_id, role, exp } từ decoded payload.
 *   3. Gọi authService.refreshToken() → Immutable Rotation (exp không đổi).
 *
 * @route  POST /api/auth/refresh-token
 * @access Public (chỉ cần refresh token hợp lệ)
 */
export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
): Promise<void> => {
  const { refresh_token } = req.body
  const { user_id, role, exp } = req.decored_refresh_token as TokenPayload

  const result = await authService.refreshToken({
    user_id,
    role,
    refresh_token,
    exp
  })

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESSFUL,
    result
  })
}

/**
 * Logout — revoke refresh token.
 *
 * Precondition:
 *   - accessTokenValidator đã xác thực access token.
 *   - refreshTokenValidator đã xác thực refresh token và tokenHash còn trong DB.
 *
 * Bảo mật:
 *   - Yêu cầu cả access token VÀ refresh token để logout.
 *   - Ngăn attacker chỉ có refresh token dùng để logout session của người khác.
 *
 * @route  POST /api/auth/logout
 * @access Private (cần cả Access Token + Refresh Token)
 */
export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response
): Promise<void> => {
  const { refresh_token } = req.body

  const result = await authService.logout(refresh_token)

  res.status(HTTP_STATUS.OK).json(result)
}

/**
 * Forgot Password — gửi email reset password.
 *
 * Precondition:
 *   - forgotPasswordValidator đã validate email format.
 *
 * Bảo mật:
 *   - Luôn trả về cùng message dù email có tồn tại hay không.
 *   - Ngăn email enumeration attack.
 *
 * @route  POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
): Promise<void> => {
  const { email } = req.body

  const result = await authService.forgotPassword(email)

  res.status(HTTP_STATUS.OK).json(result)
}

/**
 * Reset Password — đổi mật khẩu bằng token từ email.
 *
 * Precondition:
 *   - resetPasswordValidator đã validate token và newPassword format.
 *
 * @route  POST /api/auth/reset-password
 * @access Public
 */
export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
): Promise<void> => {
  const { token, newPassword } = req.body

  const result = await authService.resetPassword(token, newPassword)

  res.status(HTTP_STATUS.OK).json(result)
}

/**
 * Change Password — đổi mật khẩu khi đã đăng nhập.
 *
 * Precondition:
 *   - accessTokenValidator đã xác thực access token.
 *   - requireAuth đã xác nhận user còn active.
 *   - changePasswordValidator đã validate oldPassword và newPassword format.
 *   - req.decoded_auth chứa user_id.
 *
 * @route  PATCH /api/auth/change-password
 * @access Private (authenticated users)
 */
export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response
): Promise<void> => {
  const { user_id } = req.decoded_auth as TokenPayload
  const { oldPassword, newPassword } = req.body

  const result = await authService.changePassword(user_id, oldPassword, newPassword)

  res.status(HTTP_STATUS.OK).json(result)
}
