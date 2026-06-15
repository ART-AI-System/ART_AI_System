import { Router } from 'express'
import {
  registerStudentController,
  loginController,
  logoutController,
  refreshTokenController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController
} from '~/controllers/auth.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerStudentValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator
} from '~/middlewares/validation.middlewares'
import { requireAuth } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

// ==========================================
// AUTH ROUTER — ART-AI System
// ==========================================
// Base path: /api/auth (định nghĩa trong src/index.ts)
//
// Endpoints theo ART_AI_API_SPEC.md Section 1.1:
//   POST   /api/auth/register/student   — Đăng ký sinh viên (Public)
//   POST   /api/auth/login              — Đăng nhập (Public)
//   POST   /api/auth/refresh-token      — Refresh token (Public + valid refresh token)
//   POST   /api/auth/logout             — Đăng xuất (Private)
//   POST   /api/auth/forgot-password    — Yêu cầu reset password (Public)
//   POST   /api/auth/reset-password     — Đặt lại password bằng token (Public)
//   PATCH  /api/auth/change-password    — Đổi password khi đã login (Private)
//
// Request Flow (ARCHITECTURE.md):
//   Route → Validation Middleware → [Auth Middleware] → Controller → Service → DB → Response
// ==========================================

const authRouter = Router()

// ==========================================
// POST /api/auth/register/student
// ==========================================
// Student tự đăng ký tài khoản.
// Role mặc định: STUDENT, Status: active
//
// Body: { studentCode, fullName, email, password }
// Response 201: { message, result: { id, studentCode, fullName, email, role } }
// Response 422: validation errors
// ==========================================
authRouter.post(
  '/register/student',
  registerStudentValidator,
  wrapRequestHandler(registerStudentController)
)

// ==========================================
// POST /api/auth/login
// ==========================================
// Đăng nhập. Tự động phân biệt student/staff qua body fields:
//   - { studentCode, password } → Student Login
//   - { username, password }    → Staff Login
//
// Response 200: { message, result: { access_token, refresh_token, user } }
// Response 401: credentials incorrect hoặc account inactive
// Response 422: format validation errors
// ==========================================
authRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

// ==========================================
// POST /api/auth/refresh-token
// ==========================================
// Làm mới token pair (Immutable Rotation).
// Token cũ bị revoke ngay lập tức. Token mới có cùng exp với token cũ.
//
// Body: { refresh_token }
// Response 200: { message, result: { access_token, refresh_token } }
// Response 401: token invalid/expired/revoked
// ==========================================
authRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

// ==========================================
// POST /api/auth/logout
// ==========================================
// Đăng xuất. Revoke refresh token (xóa tokenHash khỏi DB).
// Yêu cầu cả Access Token + Refresh Token để ngăn DoS attack.
//
// Headers: Authorization: Bearer <access_token>
// Body: { refresh_token }
// Response 200: { message: "Logout successful" }
// ==========================================
authRouter.post(
  '/logout',
  accessTokenValidator,
  refreshTokenValidator,
  wrapRequestHandler(logoutController)
)

// ==========================================
// POST /api/auth/forgot-password
// ==========================================
// Yêu cầu gửi email reset password.
// Luôn trả về cùng message dù email có tồn tại hay không (security).
// DEV: log raw token ra console. PROD: gửi qua email service.
//
// Body: { email }
// Response 200: { message: "Check your email..." }
// ==========================================
authRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

// ==========================================
// POST /api/auth/reset-password
// ==========================================
// Đặt lại password bằng token từ email.
// Token chỉ dùng được 1 lần và có thời hạn 1 giờ.
//
// Body: { token, newPassword }
// Response 200: { message: "Reset password successful" }
// Response 400: token invalid/expired/used
// ==========================================
authRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

// ==========================================
// PATCH /api/auth/change-password
// ==========================================
// Đổi password khi đang đăng nhập.
// Yêu cầu xác thực old password và new password phải khác old.
//
// Headers: Authorization: Bearer <access_token>
// Body: { oldPassword, newPassword }
// Response 200: { message: "Password changed successfully" }
// Response 400: old password incorrect / same as new
// Response 401: access token invalid
// ==========================================
authRouter.patch(
  '/change-password',
  accessTokenValidator,
  requireAuth,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default authRouter
