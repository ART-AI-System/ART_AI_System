import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { UserRole } from '~/models/schemas/users.schema'


export interface RegisterReqBody {
  fullName: string
  email: string
  password: string
  confirm_password: string
  role?: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  iat: number
  exp: number
}

/**
 * POST /api/users — Admin creates a new user.
 * Password is set by admin, sent in plain text and hashed in service.
 */
export interface CreateUserReqBody {
  fullName: string
  email: string
  password: string
  role: UserRole
  studentCode?: string
  profile?: Record<string, any>
}

/**
 * PUT /api/users/:id — Admin updates a user's information.
 * Cannot change email or password via this route.
 */
export interface UpdateUserReqBody {
  fullName?: string
  role?: UserRole
  studentCode?: string | null
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
  role: UserRole
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
  role?: UserRole
  isActive?: string
  search?: string
}
