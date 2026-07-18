import { wrapRequestHandler } from '~/utils/handlers'
import { Router } from 'express'
import {
  // Module 1 Auth Controllers (preserved)
  emailVerifyController,
  forgotPasswordController,
  oauthController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  verifyForgotPasswordController,
  // Module 2 Self Profile Controllers
  getMeController,
  updateMeController,
  // Module 2 Admin User Management Controllers
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  updateUserStatusController,
  updateUserRoleController,
  adminResetPasswordController,
  deleteUserController,
  importUsersController
} from '~/controllers/users.controller'
import {
  // Module 1 Validators (preserved)
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  registerValidator,
  resetPasswordValidator,
  verifiedUserValidator,
  verifyForgotPasswordValidator,
  // Module 2 Validators
  updateMeValidator,
  createUserValidator,
  updateUserValidator,
  updateUserStatusValidator,
  updateUserRoleValidator,
  adminResetPasswordValidator
} from '~/middlewares/users.middleware'

import { accessTokenValidator } from '~/middlewares/validation.middlewares'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { parseImportFile } from '~/middlewares/import.middleware'

const usersRouter = Router()

// ==========================================
// MODULE 1: AUTH ROUTES (preserved for backward compatibility)
// ==========================================

/**
 * POST /api/users/register
 * Public self-registration. Creates a user with UNVERIFIED status.
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * GET /api/users/oauth/google
 * Google OAuth callback. Public.
 */
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))

/**
 * POST /api/users/verify-email
 * Email verification. Public.
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyController))

/**
 * POST /api/users/resend-verify-email
 * Resend email verification. Requires valid access token.
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * POST /api/users/forgot-password
 * Initiate password reset. Public.
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * POST /api/users/verify-forgot-password
 * Verify forgot password token. Public.
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * POST /api/users/reset-password
 * Reset password with forgot-password token. Public.
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

// ==========================================
// MODULE 2: SELF PROFILE ROUTES
// Access: All authenticated users (STUDENT | LECTURER | SUBJECT_HEAD | ADMIN)
// ==========================================

/**
 * GET  /api/users/me — Get current user's own profile.
 * PATCH /api/users/me — Update current user's own profile (fullName, profile only).
 *
 * Flow:
 *   requireAuth → [updateMeValidator] → Controller → Service → DB → Response
 */
usersRouter
  .route('/me')
  .get(requireAuth, wrapRequestHandler(getMeController))
  .patch(requireAuth, updateMeValidator, wrapRequestHandler(updateMeController))

// ==========================================
// MODULE 2: ADMIN IMPORT ROUTE
// Defined BEFORE /:id routes to avoid param conflict.
// Access: ADMIN only
// ==========================================

/**
 * POST /api/users/import
 * Import users from a CSV or Excel file.
 * Multipart/form-data with field: file
 *
 * Returns import summary:
 *   { totalRows, success, failed, errors: [{ row, reason }] }
 *
 * Flow:
 *   requireAuth → requireRole('ADMIN') → parseImportFile → Controller → Service → DB → Response
 */
usersRouter.post(
  '/import',
  requireAuth,
  requireRole('ADMIN'),
  parseImportFile,
  wrapRequestHandler(importUsersController)
)

// ==========================================
// MODULE 2: ADMIN USER LIST & CREATE ROUTES
// Access: ADMIN only
// ==========================================

/**
 * GET  /api/users — Get paginated, filterable user list.
 *   Query params: page, limit, role, isActive, search
 *
 * POST /api/users — Admin creates a new user.
 *   Body: { fullName, email, password, role, studentCode?, profile? }
 *
 * Flow:
 *   requireAuth → requireRole('ADMIN') → [validator] → Controller → Service → DB → Response
 */
usersRouter
  .route('/')
  .get(requireAuth, requireRole('ADMIN'), wrapRequestHandler(getUsersController))
  .post(requireAuth, requireRole('ADMIN'), createUserValidator, wrapRequestHandler(createUserController))

// ==========================================
// MODULE 2: ADMIN INDIVIDUAL USER ROUTES
// Access: ADMIN only
// ==========================================

/**
 * GET /api/users/:id — Get a single user by ID.
 *
 * Flow:
 *   requireAuth → requireRole('ADMIN') → Controller → Service → DB → Response
 */
usersRouter.get('/:id', requireAuth, requireRole('ADMIN', 'LECTURER'), wrapRequestHandler(getUserByIdController))

/**
 * PUT /api/users/:id — Admin updates a user's general info.
 *   Body: { fullName?, role?, studentCode?, profile? }
 *   Cannot update: email, password.
 *
 * Flow:
 *   requireAuth → requireRole('ADMIN') → updateUserValidator → Controller → Service → DB → Response
 */
usersRouter.put('/:id', requireAuth, requireRole('ADMIN'), updateUserValidator, wrapRequestHandler(updateUserController))

/**
 * PATCH /api/users/:id/status — Admin activates or deactivates a user.
 *   Body: { isActive: boolean }
 *   Cannot be used on self.
 *
 * Flow:
 *   requireAuth → requireRole('ADMIN') → updateUserStatusValidator → Controller → Service → DB → Response
 */
usersRouter.patch(
  '/:id/status',
  requireAuth,
  requireRole('ADMIN'),
  updateUserStatusValidator,
  wrapRequestHandler(updateUserStatusController)
)

/**
 * PATCH /api/users/:id/role — Admin changes a user's role.
 *   Body: { role: UserRole }
 *
 * Flow:
 *   requireAuth → requireRole('ADMIN') → updateUserRoleValidator → Controller → Service → DB → Response
 */
usersRouter.patch(
  '/:id/role',
  requireAuth,
  requireRole('ADMIN'),
  updateUserRoleValidator,
  wrapRequestHandler(updateUserRoleController)
)

/**
 * PATCH /api/users/:id/reset-password — Admin resets a user's password.
 *   Body: { password: string }
 *
 * Flow:
 *   requireAuth → requireRole('ADMIN') → adminResetPasswordValidator → Controller → Service → DB → Response
 */
usersRouter.patch(
  '/:id/reset-password',
  requireAuth,
  requireRole('ADMIN'),
  adminResetPasswordValidator,
  wrapRequestHandler(adminResetPasswordController)
)

/**
 * DELETE /api/users/:id — Soft delete a user (isActive = false).
 *   Cannot be used on self.
 *   User record is NEVER physically removed.
 *
 * Flow:
 *   requireAuth → requireRole('ADMIN') → Controller → Service → DB → Response
 */
usersRouter.delete('/:id', requireAuth, requireRole('ADMIN'), wrapRequestHandler(deleteUserController))

export default usersRouter
