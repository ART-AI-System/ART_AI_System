import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserRole } from '~/constants/enums'
import { UserRoleType } from '~/models/schemas/users.schema'

// ==========================================
// MODULE 1: AUTH REQUEST TYPES
// ==========================================

/**
 * POST /api/auth/register/student
 * Student tự đăng ký tài khoản.
 */
export interface RegisterStudentReqBody {
  studentCode: string
  fullName: string
  email: string
  password: string
}

/**
 * POST /api/auth/login — Student (dùng studentCode)
 */
export interface StudentLoginReqBody {
  studentCode: string
  password: string
}

/**
 * POST /api/auth/login — Staff (lecturer/subject_head/admin, dùng username)
 */
export interface StaffLoginReqBody {
  username: string
  password: string
}

/**
 * Union type cho login request — validator sẽ phân tách
 */
export interface LoginReqBody {
  studentCode?: string
  username?: string
  email?: string  // giữ lại backward compat
  password: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

/**
 * POST /api/auth/forgot-password
 */
export interface ForgotPasswordReqBody {
  email: string
}

/**
 * POST /api/auth/reset-password
 */
export interface ResetPasswordReqBody {
  token: string
  newPassword: string
}

/**
 * PATCH /api/auth/change-password
 */
export interface ChangePasswordReqBody {
  oldPassword: string
  newPassword: string
}

/**
 * JWT payload cho access token và refresh token.
 * - user_id: ObjectId string của user
 * - token_type: ACCESS_TOKEN | REFRESH_TOKEN
 * - role: UserRole của user (đọc từ DB khi tạo token)
 */
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  role: UserRoleType
  iat: number
  exp: number
}

// ==========================================
// MODULE 2: USER MANAGEMENT REQUEST TYPES
// ==========================================

/**
 * POST /api/users — Admin creates a new user.
 * Password is set by admin, sent in plain text and hashed in service.
 */
export interface CreateUserReqBody {
  fullName: string
  email: string
  password: string
  role: UserRoleType
  studentCode?: string
  username?: string
  profile?: Record<string, any>
}

/**
 * PUT /api/users/:id — Admin updates a user's information.
 * Cannot change email or password via this route.
 */
export interface UpdateUserReqBody {
  fullName?: string
  role?: UserRoleType
  studentCode?: string | null
  username?: string | null
  profile?: Record<string, any>
}

/**
 * PATCH /api/users/:id/status — Admin activates or deactivates a user.
 */
export interface UpdateUserStatusReqBody {
  /** true = ACTIVE, false = INACTIVE */
  isActive: boolean
}

/**
 * PATCH /api/users/:id/role — Admin updates a user's role.
 */
export interface UpdateUserRoleReqBody {
  role: UserRoleType
}

/**
 * PATCH /api/users/:id/reset-password — Admin resets a user's password.
 */
export interface AdminResetPasswordReqBody {
  password: string
}

/**
 * PATCH /api/users/me — Authenticated user updates their own profile.
 * Cannot change role, email, or password via this route.
 */
export interface UpdateMeReqBody {
  fullName?: string
  profile?: Record<string, any>
}

/**
 * Query parameters for GET /api/users list endpoint.
 */
export interface GetUsersQuery {
  page?: string
  limit?: string
  role?: UserRoleType
  isActive?: string
  search?: string
}

// ==========================================
// LEGACY TYPES (kept for backward compat)
// ==========================================

/**
 * @deprecated — Dùng RegisterStudentReqBody thay thế
 */
export interface RegisterReqBody {
  fullName: string
  email: string
  password: string
  confirm_password: string
  role?: string
}

/**
 * @deprecated — Không dùng trong ART-AI flow
 */
export interface VerifyEmailReqBody {
  email_verify_token: string
}

/**
 * @deprecated — Không dùng trong ART-AI flow
 */
export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}
