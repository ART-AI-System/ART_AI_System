import { Router } from 'express'
import { loginController, logoutController, refreshTokenController } from '~/controllers/auth.controllers'
import { accessTokenValidator, loginValidator, refreshTokenValidator } from '~/middlewares/validation.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

// ==========================================
// AUTH ROUTER
// ==========================================
// Định nghĩa các endpoint xác thực theo API Spec (ART_AI_API_SPEC.md, Section 1.1):
//   POST /api/auth/login          - Đăng nhập
//   POST /api/auth/refresh-token  - Làm mới cặp token (Rotation)
//   POST /api/auth/logout         - Đăng xuất
//
// Tuân thủ Request Flow trong ARCHITECTURE.md:
//   Route → Authentication/Validation Middleware → Controller → Service → DB → Response
//
// Nguyên tắc thiết kế:
//   - Route file chỉ chứa định nghĩa endpoint, gắn middleware và mapping controller.
//   - Không chứa business logic và database queries.
//   - Tất cả controller async được bọc bởi wrapRequestHandler() để tự động
//     bắt lỗi và chuyển lên defaultErrorHandler, không cần try-catch.
// ==========================================

const authRouter = Router()

/**
 * @route  POST /api/auth/login
 * @desc   Đăng nhập bằng email và password.
 * @access Public
 *
 * Request Body:
 *   {
 *     email:    string  - Email đã đăng ký, bắt buộc, đúng format email.
 *     password: string  - Mật khẩu, bắt buộc, 6-50 ký tự.
 *   }
 *
 * Response 200:
 *   {
 *     message: "Login successful",
 *     result: {
 *       access_token:  string  - JWT Access Token (ngắn hạn).
 *       refresh_token: string  - JWT Refresh Token (dài hạn, lưu vào DB).
 *     }
 *   }
 *
 * Response 422 (Validation Error):
 *   { message: "...", errors: { email: {...}, password: {...} } }
 *
 * Middleware chain:
 *   loginValidator → Xác thực format + truy vấn DB tìm user → gắn req.user
 *   loginController → Ký token + lưu refresh token vào DB → trả response
 */
authRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * @route  POST /api/auth/refresh-token
 * @desc   Làm mới cặp Access Token + Refresh Token (Immutable Rotation).
 *         Refresh token cũ bị revoke, refresh token mới được phát hành
 *         với cùng thời gian hết hạn (exp) như token cũ.
 * @access Public (chỉ cần refresh token hợp lệ trong body)
 *
 * Request Body:
 *   {
 *     refresh_token: string  - Refresh token còn hiệu lực và tồn tại trong DB.
 *   }
 *
 * Response 200:
 *   {
 *     message: "Refresh token successful",
 *     result: {
 *       access_token:  string  - Access Token mới.
 *       refresh_token: string  - Refresh Token mới (token cũ đã bị revoke).
 *     }
 *   }
 *
 * Response 401 (Unauthorized):
 *   { message: "Refresh token is required" }         - Thiếu token
 *   { message: "Refresh token is invalid" }          - Sai chữ ký / hết hạn
 *   { message: "Used refresh token or not exists" }  - Token đã revoke / không tồn tại
 *
 * Middleware chain:
 *   refreshTokenValidator → Xác thực chữ ký JWT + kiểm tra DB → gắn req.decored_refresh_token
 *   refreshTokenController → Rotation: revoke cũ + phát hành mới → trả response
 */
authRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * @route  POST /api/auth/logout
 * @desc   Đăng xuất. Revoke refresh token khỏi DB để ngăn tái sử dụng.
 * @access Private (yêu cầu cả Access Token hợp lệ lẫn Refresh Token hợp lệ)
 *
 * Request Headers:
 *   Authorization: Bearer <access_token>
 *
 * Request Body:
 *   {
 *     refresh_token: string  - Refresh token cần revoke.
 *   }
 *
 * Response 200:
 *   { message: "Logout successful" }
 *
 * Response 401 (Unauthorized):
 *   { message: "Access token is required" }      - Thiếu / sai access token
 *   { message: "Access token is invalid" }        - Hết hạn / chữ ký sai
 *   { message: "Refresh token is required" }      - Thiếu refresh token
 *   { message: "Refresh token is invalid" }       - Chữ ký / hết hạn sai
 *   { message: "Used refresh token or not exists" } - Token đã revoke
 *
 * Middleware chain:
 *   accessTokenValidator  → Xác thực access token → gắn req.decoded_auth
 *   refreshTokenValidator → Xác thực refresh token + DB → gắn req.decored_refresh_token
 *   logoutController      → Xóa refresh token khỏi DB → trả response
 *
 * Lý do yêu cầu cả hai token để logout:
 *   Ngăn chặn attacker chỉ có refresh token của người dùng khác
 *   thực hiện logout session của họ (Denial of Service).
 */
authRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

export default authRouter
