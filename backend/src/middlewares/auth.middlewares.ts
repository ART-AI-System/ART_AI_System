import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { UserRoleType } from '~/models/schemas/users.schema'
import { UserStatus } from '~/constants/enums'
import { TokenPayload } from '~/models/requests/users.request'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.service'
import { accessTokenValidator } from '~/middlewares/validation.middlewares'

// ==========================================
//   1. requireAuth
//      ─ Xác thực JWT Access Token (delegate sang accessTokenValidator).
//      ─ Sau đó tra DB lấy user document đầy đủ:
//        + Kiểm tra user tồn tại (không bị xóa khỏi DB).
//        + Kiểm tra isActive = true (không bị ban/deactivate).
//      ─ Gắn req.user = user document để downstream middleware và
//        controller dùng trực tiếp mà không cần tra DB thêm lần nữa.
//
//   2. requireRole(...roles)
//      ─ Higher-Order Function: nhận danh sách role được phép, trả về middleware.
//      ─ Đọc req.user (đã gắn bởi requireAuth trước đó trong chain).
//      ─ So sánh user.role với danh sách roles.
//      ─ Nếu không hợp lệ → 403 FORBIDDEN.
//
// Thứ tự sử dụng trong route:
//   router.get('/path', requireAuth, requireRole('ADMIN', 'LECTURER'), controller)
//
// Nguyên tắc Security First:
//   ─ Role luôn được đọc từ DB (không lấy từ JWT payload) để tránh stale data.
//     Khi Admin thay đổi role user, lần request tiếp theo sẽ reflect ngay.
//   ─ Tài khoản bị deactivate bị chặn ở tầng requireAuth, không cho phép
//     thực hiện bất kỳ action nào dù có token hợp lệ.
//   ─ Tất cả lỗi được ném dưới dạng ErrorWithStatus với HTTP code tường minh,
//     để defaultErrorHandler bắt và phản hồi đúng format.
// ==========================================

const AUTH_ERRORS = {
  USER_NOT_FOUND_OR_DEACTIVATED: 'User not found or has been deactivated',
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to access this resource',
  AUTHENTICATION_REQUIRED: 'Authentication is required to access this resource'
} as const


/**
 * Thực hiện hai bước liên tiếp:
 *
 * Bước 1 — Xác thực JWT (delegate sang accessTokenValidator):
 *   accessTokenValidator đọc header Authorization: Bearer <token>,
 *   verify chữ ký JWT, gắn req.decoded_auth = decoded payload.
 *   Nếu token thiếu / sai / hết hạn → 401.
 *
 * Bước 2 — Tra DB và kiểm tra trạng thái user:
 *   Dùng user_id từ req.decoded_auth để findOne trong collection users.
 *   Projection chỉ lấy các trường cần thiết, loại trừ password và token nhạy cảm.
 *
 *   Kiểm tra:
 *     a. user tồn tại trong DB → nếu không → 401 USER_NOT_FOUND.
 *        (Account bị xóa khỏi DB sau khi token được phát hành.)
 *     b. user.isActive === true → nếu không → 403 USER_NOT_FOUND_OR_DEACTIVATED.
 *        (Account bị ban, deactivate bởi Admin.)
 *
 *   Nếu hợp lệ → gắn req.user = user document để controller/middleware sau dùng.
 *
 * Tại sao lookup DB thay vì dùng role từ JWT payload?
 *   JWT payload chỉ lưu { user_id, token_type, verify } — không có role.
 *   Kể cả nếu JWT có role, role có thể stale nếu Admin thay đổi sau khi phát hành token.
 *   DB lookup đảm bảo role luôn real-time và chính xác.
 *
 * Tại sao không dùng verifiedUserValidator từ validation.middlewares.ts?
 *   verifiedUserValidator chỉ check UserVerifyStatus (email verification).
 *   requireAuth check isActive (account status) — hai khái niệm khác nhau.
 *
 * @example
 *   router.get('/api/users/me', requireAuth, getMeController)
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  // Bước 1: Xác thực JWT bằng cách chạy accessTokenValidator trước.
  // accessTokenValidator là một async middleware trả về Promise.
  // Sau khi nó gọi next() hoặc next(error), ta mới tiếp tục bước 2.
  accessTokenValidator(req, res, async (jwtError?: any) => {
    // Nếu accessTokenValidator phát hiện lỗi (token thiếu / sai / hết hạn),
    // nó sẽ gọi next(jwtError) — ta forward lỗi này lên defaultErrorHandler.
    if (jwtError) {
      return next(jwtError)
    }

    // Bước 2: JWT đã hợp lệ. Tiến hành tra DB để lấy user document đầy đủ.
    try {
      const { user_id } = req.decoded_auth as TokenPayload

      // Projection: loại trừ các trường nhạy cảm.
      // ─ password: không bao giờ expose ra ngoài tầng service.
      // ─ email_verify_token, forgot_password_token: token dùng một lần,
      //   không cần thiết ở tầng controller/middleware.
      const user = await databaseService.users.findOne(
        { _id: new ObjectId(user_id) },
        {
          projection: {
            password: 0,
            email_verify_token: 0,
            forgot_password_token: 0
          }
        }
      )

      // Kiểm tra (a): user có tồn tại trong DB không?
      // Trường hợp: token hợp lệ nhưng user đã bị xóa khỏi hệ thống.
      if (!user) {
        return next(
          new ErrorWithStatus({
            message: USERS_MESSAGES.USER_NOT_FOUND,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        )
      }

      // Kiểm tra (b): tài khoản có đang active không?
      // Trường hợp: Admin deactivate user nhưng token vẫn chưa hết hạn.
      // Check status field (ART-AI spec) với fallback sang isActive (backward compat)
      const isDeactivated =
        (user as any).status === UserStatus.INACTIVE ||
        (user as any).status === 'inactive' ||
        (user as any).isActive === false

      if (isDeactivated) {
        return next(
          new ErrorWithStatus({
            message: AUTH_ERRORS.USER_NOT_FOUND_OR_DEACTIVATED,
            status: HTTP_STATUS.FORBIDDEN
          })
        )
      }

      // Gắn user document lên request để controller và các middleware sau
      // dùng trực tiếp mà không cần tra DB thêm lần nữa.
      req.user = user

      return next()
    } catch (dbError) {
      // Lỗi không mong đợi từ DB (network, timeout, v.v.)
      return next(dbError)
    }
  })
}


/**
 * Nhận một hoặc nhiều role được phép truy cập route.
 * Trả về một middleware kiểm tra req.user.role có nằm trong danh sách đó không.
 *
 * QUAN TRỌNG:
 *   requireRole PHẢI được dùng SAU requireAuth trong middleware chain.
 *   requireAuth đảm bảo req.user đã được gắn sẵn trước khi requireRole chạy.
 *   Nếu thiếu requireAuth, req.user sẽ là undefined và requireRole sẽ từ chối mọi request.
 *
 * Tại sao đọc role từ req.user (DB) thay vì req.decoded_auth (JWT)?
 *   JWT payload hiện tại không chứa role (chỉ có user_id, token_type, verify).
 *   Kể cả nếu có, DB là nguồn sự thật duy nhất — role stale trong token
 *   là lỗ hổng bảo mật nghiêm trọng với Privilege Escalation.
 *
 * @param roles - Danh sách các role được phép, ít nhất 1 role.
 * @returns Express middleware function.
 *
 * @example
 *   // Chỉ ADMIN mới có quyền:
 *   router.post('/api/users', requireAuth, requireRole('ADMIN'), createUserController)
 *
 *   // LECTURER và SUBJECT_HEAD đều có quyền:
 *   router.get('/api/classes', requireAuth, requireRole('LECTURER', 'SUBJECT_HEAD'), getClassesController)
 *
 *   // Tất cả user đã đăng nhập đều có quyền (không cần requireRole, chỉ dùng requireAuth):
 *   router.get('/api/users/me', requireAuth, getMeController)
 */
export const requireRole = (...roles: UserRoleType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Guard: requireAuth phải được gọi trước requireRole trong chain.
    // Nếu req.user chưa được gắn, đây là lỗi cấu hình route.
    if (!req.user) {
      return next(
        new ErrorWithStatus({
          message: AUTH_ERRORS.AUTHENTICATION_REQUIRED,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      )
    }

    const userRole = req.user.role as UserRoleType

    // Kiểm tra role của user có nằm trong danh sách roles được phép không.
    // roles.includes() có O(n) với n = số roles truyền vào.
    // Trong thực tế n <= 4 (STUDENT, LECTURER, SUBJECT_HEAD, ADMIN) nên O(1) trên thực tế.
    if (!roles.includes(userRole)) {
      return next(
        new ErrorWithStatus({
          message: AUTH_ERRORS.INSUFFICIENT_PERMISSIONS,
          status: HTTP_STATUS.FORBIDDEN
        })
      )
    }

    // Role hợp lệ — cho phép tiếp tục xuống controller.
    next()
  }
}

/**
 * requireAuth đã tích hợp check isActive bên trong.
 * requireActiveAccount được cung cấp như standalone guard cho các trường hợp
 * đặc biệt cần tái kiểm tra trong chain dài hoặc kết hợp với logic khác.
 *
 * QUAN TRỌNG: Phải dùng sau requireAuth vì cần req.user đã được gắn.
 *
 * @example
 *   // Chỉ dùng khi cần explicit guard riêng biệt trong chain phức tạp.
 *   router.post('/api/submissions', requireAuth, requireActiveAccount, requireRole('STUDENT'), createSubmissionController)
 */
export const requireActiveAccount = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(
      new ErrorWithStatus({
        message: AUTH_ERRORS.AUTHENTICATION_REQUIRED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    )
  }

  // Check status field (ART-AI spec) với fallback sang isActive (backward compat)
  const isDeactivated =
    (req.user as any).status === UserStatus.INACTIVE ||
    (req.user as any).status === 'inactive' ||
    (req.user as any).isActive === false

  if (isDeactivated) {
    return next(
      new ErrorWithStatus({
        message: AUTH_ERRORS.USER_NOT_FOUND_OR_DEACTIVATED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }

  next()
}
