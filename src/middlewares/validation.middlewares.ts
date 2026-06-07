import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { UserVerifyStatus } from '~/constants/enums'
import { hashPassword } from '~/constants/crypto'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/users.request'
import databaseService from '~/services/database.service'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

// ==========================================
//   - Mỗi schema tập trung kiểm tra tính hợp lệ của dữ liệu đầu vào.
//   - Các lỗi xác thực JWT / DB được ném dưới dạng ErrorWithStatus
//     để tầng error handler toàn cục (defaultErrorHandler) bắt và phản hồi
//     đúng HTTP status code, không để lọt lên controller.
//   - validate() từ utils/validation.ts gom toàn bộ lỗi express-validator,
//     phân biệt lỗi 422 (EntityError) vs lỗi 401 (ErrorWithStatus),
//     rồi gọi next(error) để defaultErrorHandler xử lý.
// ==========================================

/**
 * Validation rules:
 *   - email: bắt buộc, đúng định dạng email, trim whitespace.
 *   - password: bắt buộc, string, độ dài 6-50 ký tự.
 *   - Custom validator truy vấn DB: tìm user theo email + hashPassword(password).
 *     Nếu không tìm thấy → ném lỗi 422 EMAIL_OR_PASSWORD_INCORRECT.
 *     Nếu hợp lệ → gắn req.user = user để controller dùng trực tiếp,
 *     tránh truy vấn DB lần thứ hai trong controller.
 *
 * Side effect: gắn req.user khi xác thực thành công.
 */
export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (!user) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT)
            }
            // Gắn user lên request để loginController không cần truy vấn DB lần nữa.
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING
        },
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50_CHARACTERS
        }
      }
    },
    ['body']
  )
)

/**
 * Luồng xử lý:
 *   1. Kiểm tra refresh_token có tồn tại trong body hay không.
 *   2. Xác thực chữ ký JWT bằng JWT_SECRET_REFRESH_TOKEN.
 *   3. Song song kiểm tra token có tồn tại trong collection refreshTokens trên DB
 *      (chống replay attack với token đã bị logout hoặc đã dùng rồi).
 *   4. Nếu hợp lệ, gắn req.decored_refresh_token = decoded payload để controller dùng.
 *
 * Rủi ro bảo mật được xử lý:
 *   - Token giả mạo chữ ký  → JsonWebTokenError → 401.
 *   - Token hết hạn          → TokenExpiredError → 401.
 *   - Token đã bị revoke    → không tồn tại trong DB → 401.
 *
 * Side effect: gắn req.decored_refresh_token khi hợp lệ.
 */
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            try {
              const [decoded_refresh_token, stored_refresh_token] = await Promise.all([
                verifyToken({
                  token: value,
                  secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
                }),
                databaseService.refreshTokens.findOne({ token: value })
              ])

              if (!stored_refresh_token) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXISTS,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }

              // Gắn decoded payload lên request để auth controller dùng.
              // Giữ nguyên tên field "decored_refresh_token" (typo legacy)
              // để tương thích với type.d.ts và toàn bộ controller hiện tại.
              req.decored_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              // Re-throw ErrorWithStatus (USED_REFRESH_TOKEN_OR_NOT_EXISTS) để
              // validate() chuyển lên defaultErrorHandler.
              throw error
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

/**
 * Luồng xử lý:
 *   1. Đọc header Authorization theo định dạng "Bearer <token>".
 *   2. Tách phần token sau "Bearer ".
 *   3. Xác thực chữ ký JWT bằng JWT_SECRET_ACCESS_TOKEN.
 *   4. Gắn req.decoded_auth = decoded payload để downstream middleware/controller dùng.
 *
 * Rủi ro bảo mật được xử lý:
 *   - Header thiếu hoặc sai format → 401 ACCESS_TOKEN_IS_INVALID.
 *   - Token giả mạo/hết hạn        → 401 với message từ JsonWebTokenError.
 *
 * Side effect: gắn req.decoded_auth khi hợp lệ.
 */
export const accessTokenValidator = validate(
  checkSchema(
    {
      authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]

            if (!access_token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            try {
              const decoded_auth = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              req.decoded_auth = decoded_auth
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)

/**
 * Đọc decoded_auth (đã gắn bởi accessTokenValidator) để lấy trường verify.
 * Nếu user chưa verify email → trả về 403 FORBIDDEN với thông báo rõ ràng.
 * Dùng cho các route yêu cầu user đã verify email mới được thực hiện.
 */
export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction): void => {
  const { verify } = req.decoded_auth as TokenPayload

  if (verify !== UserVerifyStatus.VERIFIED) {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }

  next()
}
