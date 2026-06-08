import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { LoginReqBody, LogoutReqBody, RefreshTokenReqBody, TokenPayload } from '~/models/requests/users.request'
import User from '~/models/schemas/users.schema'
import authService from '~/services/auth.services'

// ==========================================
// Thin Controllers: không chứa business logic, không truy vấn DB trực tiếp.
// Nhiệm vụ:
//   1. Bóc tách payload từ req (body, params, decoded tokens).
//   2. Gọi đúng method của authService.
//   3. Trả về response HTTP chuẩn với HTTP status code và message từ constants.
//
// Tất cả function được bọc bởi wrapRequestHandler() ở tầng Route
// để tự động bắt lỗi async và chuyển lên defaultErrorHandler.
// Vì vậy, controller KHÔNG cần try-catch.
// ==========================================

/**
 * Precondition:
 *   - loginValidator đã xác thực email/password hợp lệ.
 *   - loginValidator đã truy vấn DB và gắn req.user = User document.
 *
 * Luồng:
 *   1. Đọc user từ req.user (đã được middleware gắn sẵn).
 *   2. Trích xuất user_id và verify từ user document.
 *   3. Gọi authService.login() để ký token và lưu refresh token vào DB.
 *   4. Trả về 200 OK với { message, result: { access_token, refresh_token } }.
 *
 * @route  POST /api/auth/login
 * @access Public
 */
export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response
): Promise<void> => {
  const user = req.user as User
  const user_id = user._id as ObjectId

  const result = await authService.login({
    user_id: user_id.toString(),
    verify: user.verify
  })

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESSFUL,
    result
  })
}

/**
 * Precondition:
 *   - refreshTokenValidator đã xác thực refresh_token hợp lệ và còn trong DB.
 *   - refreshTokenValidator đã gắn req.decored_refresh_token = decoded payload.
 *
 * Luồng:
 *   1. Đọc refresh_token từ req.body.
 *   2. Đọc { user_id, verify, exp } từ req.decored_refresh_token (decoded JWT payload).
 *   3. Gọi authService.refreshToken() để thực hiện Immutable Rotation.
 *   4. Trả về 200 OK với cặp token mới.
 *
 * Quyết định thiết kế:
 *   - exp được truyền xuống service để đảm bảo refresh token mới
 *     có cùng thời điểm hết hạn với token cũ (immutable expiry policy).
 *
 * @route  POST /api/auth/refresh-token
 * @access Public (chỉ cần refresh token hợp lệ)
 */
export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
): Promise<void> => {
  const { refresh_token } = req.body
  const { user_id, verify, exp } = req.decored_refresh_token as TokenPayload

  const result = await authService.refreshToken({
    user_id,
    verify,
    refresh_token,
    exp
  })

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESSFUL,
    result
  })
}

/**
 * Precondition:
 *   - accessTokenValidator đã xác thực access token hợp lệ.
 *   - refreshTokenValidator đã xác thực refresh token hợp lệ và còn trong DB.
 *
 * Luồng:
 *   1. Đọc refresh_token từ req.body.
 *   2. Gọi authService.logout() để xóa refresh token khỏi DB (revoke).
 *   3. Trả về 200 OK với message xác nhận.
 *
 * Bảo mật:
 *   - Yêu cầu cả access token VÀ refresh token hợp lệ để logout.
 *   - Điều này ngăn chặn attacker chỉ có refresh token logout session của người khác.
 *   - Sau logout, refresh token bị xóa khỏi DB, không thể dùng lại.
 *
 * @route  POST /api/auth/logout
 * @access Private (yêu cầu Access Token + Refresh Token hợp lệ)
 */
export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response
): Promise<void> => {
  const { refresh_token } = req.body

  const result = await authService.logout(refresh_token)

  res.status(HTTP_STATUS.OK).json(result)
}
