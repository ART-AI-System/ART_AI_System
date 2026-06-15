import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { UserStatus } from '~/constants/enums'
import { hashToken } from '~/constants/crypto'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/users.request'
import databaseService from '~/services/database.service'
import authService from '~/services/auth.services'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

// ==========================================
// AUTH VALIDATION MIDDLEWARES — ART-AI System
//
// Mỗi validator dùng express-validator checkSchema để:
//   1. Validate format dữ liệu đầu vào
//   2. Truy vấn DB để xác thực nghiệp vụ (login, refresh token)
//   3. Gắn kết quả lên req (req.user, req.decoded_auth, req.decored_refresh_token)
//      để controller không cần tái truy vấn DB
//
// Lỗi nghiệp vụ (401/403) → ném ErrorWithStatus
// Lỗi validation format → ném Error thường (express-validator → 422)
// ==========================================

// ==========================================
// LOGIN VALIDATOR
// ==========================================
// Phân tách 2 luồng dựa trên body:
//   - studentCode có mặt → Student Login
//   - username có mặt    → Staff Login (lecturer/subject_head/admin)
//   - email có mặt       → Legacy email login (backward compat)
// ==========================================

export const loginValidator = validate(
  checkSchema(
    {
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING
        }
      },
      /**
       * Custom validator phân tách student/staff login và xác thực credentials.
       * Gắn req.user nếu thành công để loginController không cần query DB lại.
       */
      _loginCredentials: {
        custom: {
          options: async (value: any, { req }) => {
            const { studentCode, username, email, password } = req.body

            if (!password) return true // password validator sẽ xử lý lỗi này

            // === STUDENT LOGIN (studentCode + password) ===
            if (studentCode) {
              if (typeof studentCode !== 'string' || studentCode.trim().length === 0) {
                throw new Error(USERS_MESSAGES.STUDENT_CODE_IS_INVALID)
              }

              const user = await authService.findStudentByCodeAndPassword(studentCode.trim(), password)

              if (!user) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.STUDENT_CODE_OR_PASSWORD_INCORRECT,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }

              // Student chỉ được là STUDENT role
              if ((user as any).role !== 'STUDENT') {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.STAFF_CANNOT_LOGIN_WITH_STUDENT_CODE,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }

              // Student được phép login nếu: active hoặc pending_activation
              const status = (user as any).status
              if (status === UserStatus.INACTIVE) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.ACCOUNT_INACTIVE,
                  status: HTTP_STATUS.FORBIDDEN
                })
              }

              req.user = user
              return true
            }

            // === STAFF LOGIN (username + password) ===
            if (username) {
              if (typeof username !== 'string' || username.trim().length === 0) {
                throw new Error(USERS_MESSAGES.USERNAME_IS_INVALID)
              }

              const user = await authService.findStaffByUsernameAndPassword(username.trim(), password)

              if (!user) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USERNAME_OR_PASSWORD_INCORRECT,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }

              // Staff chỉ là LECTURER, SUBJECT_HEAD, ADMIN
              const role = (user as any).role
              if (role === 'STUDENT') {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.STUDENT_CANNOT_LOGIN_WITH_USERNAME,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }

              // Staff chỉ được active mới login
              const status = (user as any).status
              if (status !== UserStatus.ACTIVE) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.ACCOUNT_INACTIVE,
                  status: HTTP_STATUS.FORBIDDEN
                })
              }

              req.user = user
              return true
            }

            // === LEGACY EMAIL LOGIN (backward compat) ===
            if (email) {
              const user = await authService.findUserByEmailAndPassword(email, password)
              req.user = user
              return true
            }

            // Không có studentCode, username, email
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.INVALID_LOGIN_CREDENTIALS,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
        }
      }
    },
    ['body']
  )
)

// ==========================================
// REGISTER STUDENT VALIDATOR
// ==========================================

export const registerStudentValidator = validate(
  checkSchema(
    {
      studentCode: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.STUDENT_CODE_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.STUDENT_CODE_IS_INVALID
        },
        trim: true,
        isLength: {
          options: { min: 1, max: 20 },
          errorMessage: USERS_MESSAGES.STUDENT_CODE_IS_INVALID
        }
      },
      fullName: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.FULL_NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.FULL_NAME_MUST_BE_STRING
        },
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: USERS_MESSAGES.FULL_NAME_LENGTH
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING
        },
        isLength: {
          options: { min: 8, max: 50 },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50_CHARACTERS
        },
        isStrongPassword: {
          options: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
          errorMessage: USERS_MESSAGES.PASSWORD_NOT_STRONG_ENOUGH
        }
      }
    },
    ['body']
  )
)

// ==========================================
// FORGOT PASSWORD VALIDATOR
// ==========================================

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true
      }
    },
    ['body']
  )
)

// ==========================================
// RESET PASSWORD VALIDATOR
// ==========================================

export const resetPasswordValidator = validate(
  checkSchema(
    {
      token: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.RESET_TOKEN_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.RESET_TOKEN_IS_REQUIRED
        },
        trim: true
      },
      newPassword: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.NEW_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING
        },
        isLength: {
          options: { min: 8, max: 50 },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50_CHARACTERS
        },
        isStrongPassword: {
          options: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
          errorMessage: USERS_MESSAGES.PASSWORD_NOT_STRONG_ENOUGH
        }
      }
    },
    ['body']
  )
)

// ==========================================
// CHANGE PASSWORD VALIDATOR
// ==========================================

export const changePasswordValidator = validate(
  checkSchema(
    {
      oldPassword: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.OLD_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING
        }
      },
      newPassword: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.NEW_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING
        },
        isLength: {
          options: { min: 8, max: 50 },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50_CHARACTERS
        },
        isStrongPassword: {
          options: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
          errorMessage: USERS_MESSAGES.PASSWORD_NOT_STRONG_ENOUGH
        }
      }
    },
    ['body']
  )
)

// ==========================================
// REFRESH TOKEN VALIDATOR
// ==========================================
// Xác thực refresh token:
//   1. Verify chữ ký JWT
//   2. Hash token → tìm tokenHash trong DB (chống replay attack)
//   3. Gắn decoded payload lên req.decored_refresh_token

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
              const decoded_refresh_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
              })

              // Kiểm tra tokenHash trong DB
              const tokenHash = hashToken(value)
              const stored_refresh_token = await databaseService.refreshTokens.findOne({ tokenHash })

              if (!stored_refresh_token) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXISTS,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }

              req.decored_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
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

// ==========================================
// ACCESS TOKEN VALIDATOR
// ==========================================
// Đọc header Authorization: Bearer <token>
// Verify JWT, gắn decoded payload lên req.decoded_auth

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

// ==========================================
// LEGACY: verifiedUserValidator
// ==========================================
// Giữ lại để không break users.middleware.ts và users.routes.ts
// Trong ART-AI, luôn pass (không có email verify flow)
// ==========================================

/**
 * @deprecated — Không còn dùng trong ART-AI.
 * Giữ lại để backward compat với users.routes.ts.
 * Trong ART-AI context, luôn gọi next() vì không có email verify flow.
 */
export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction): void => {
  // ART-AI không có email verification flow.
  // Luôn allow để không break các route đang dùng validator này.
  next()
}
