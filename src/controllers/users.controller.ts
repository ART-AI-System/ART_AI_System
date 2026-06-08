import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  VerifyEmailReqBody,
  VerifyForgotPasswordReqBody,
  UpdateMeReqBody,
  CreateUserReqBody,
  UpdateUserReqBody,
  UpdateUserStatusReqBody,
  UpdateUserRoleReqBody,
  GetUsersQuery
} from '~/models/requests/users.request'
import User from '~/models/schemas/users.schema'
import usersService from '~/services/users.service'
import { ParamsDictionary } from 'express-serve-static-core'
import databaseService from '~/services/database.service'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'
import path from 'path'
import fs from 'fs'

// ==========================================
// MODULE 1: AUTH CONTROLLERS (preserved)
// ==========================================

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESSFUL,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    return res.json({
      message: USERS_MESSAGES.REGISTER_SUCCESSFUL,
      result
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: USERS_MESSAGES.REGISTER_FAILED
    })
  }
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.json(result)
}

export const oauthController = async (req: Request, res: Response) => {
  const { code } = req.query
  const result = await usersService.oauthGoogle(code as string)
  const urlRedirect = `${process.env.CLIENT_REDIRECT_CALLBACK}?access_token=${result.access_token}
  &refresh_token=${result.refresh_token}&newUser=${result.newUser}&verify=${result.verify}`
  console.log('Redirecting to:', urlRedirect)
  return res.redirect(urlRedirect)
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const { user_id, verify, exp } = req.decored_refresh_token as TokenPayload
  const result = await usersService.refreshToken({ user_id, verify, refresh_token, exp })
  return res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESSFUL,
    result
  })
}

export const emailVerifyController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED
    })
  }
  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESSFUL,
    result
  })
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_auth as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.VERIFIED) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED
    })
  }
  const result = await usersService.resendVerifyEmail(user_id)
  return res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify } = req.user as User
  const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  return res.json(result)
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESSFUL
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(user_id, password)
  return res.json(result)
}

// ==========================================
// MODULE 2: SELF PROFILE CONTROLLERS
// ==========================================

/**
 * GET /users/me
 * Returns the current authenticated user's profile.
 * Access: All authenticated users (requireAuth applies)
 */
export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_auth as TokenPayload
  const user = await usersService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESSFUL,
    result: user
  })
}

/**
 * PATCH /users/me
 * Updates the authenticated user's own profile (fullName, profile only).
 * Cannot change: email, password, role.
 * Access: All authenticated users (requireAuth applies)
 */
export const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_auth as TokenPayload
  const result = await usersService.updateMe(user_id, req.body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESSFUL,
    result
  })
}

// ==========================================
// MODULE 2: ADMIN USER MANAGEMENT CONTROLLERS
// ==========================================

/**
 * GET /users
 * Returns a paginated, filterable list of all users.
 * Supports query params: page, limit, role, isActive, search
 * Access: ADMIN only
 */
export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query as unknown as GetUsersQuery
  const result = await usersService.getUsers(query)
  return res.json({
    message: USERS_MESSAGES.GET_USERS_SUCCESSFUL,
    result
  })
}

/**
 * GET /users/:id
 * Returns a single user by ID.
 * Access: ADMIN only
 */
export const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const user = await usersService.getUserById(id as string)
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  return res.json({
    message: USERS_MESSAGES.GET_USER_SUCCESSFUL,
    result: user
  })
}

/**
 * POST /users
 * Admin creates a new user. User is auto-verified (no email flow).
 * Access: ADMIN only
 */
export const createUserController = async (
  req: Request<ParamsDictionary, any, CreateUserReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.createUser(req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: USERS_MESSAGES.CREATE_USER_SUCCESSFUL,
    result
  })
}

/**
 * PUT /users/:id
 * Admin updates a user's general information (fullName, role, studentCode, profile).
 * Cannot update: email, password.
 * Access: ADMIN only
 */
export const updateUserController = async (
  req: Request<ParamsDictionary, any, UpdateUserReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const result = await usersService.updateUser(id as string, req.body)
  if (!result) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  return res.json({
    message: USERS_MESSAGES.UPDATE_USER_SUCCESSFUL,
    result
  })
}

/**
 * PATCH /users/:id/status
 * Admin activates or deactivates a user.
 * Security: Admin cannot change their own status (self-lock prevention).
 * Access: ADMIN only
 */
export const updateUserStatusController = async (
  req: Request<ParamsDictionary, any, UpdateUserStatusReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const { user_id } = req.decoded_auth as TokenPayload

  // Fail-closed: Admin cannot deactivate themselves
  if (id === user_id) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      message: USERS_MESSAGES.CANNOT_CHANGE_OWN_STATUS
    })
  }

  const { isActive } = req.body
  const result = await usersService.updateUserStatus(id as string, isActive)
  if (!result) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  return res.json({
    message: USERS_MESSAGES.UPDATE_USER_STATUS_SUCCESSFUL,
    result
  })
}

/**
 * PATCH /users/:id/role
 * Admin changes a user's role.
 * Access: ADMIN only
 */
export const updateUserRoleController = async (
  req: Request<ParamsDictionary, any, UpdateUserRoleReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const { role } = req.body
  const result = await usersService.updateUserRole(id as string, role)
  if (!result) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  return res.json({
    message: USERS_MESSAGES.UPDATE_USER_ROLE_SUCCESSFUL,
    result
  })
}

/**
 * DELETE /users/:id
 * Soft delete: sets isActive = false. User record is NEVER physically removed.
 * Security: Admin cannot delete themselves.
 * Access: ADMIN only
 */
export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { user_id } = req.decoded_auth as TokenPayload

  // Fail-closed: Admin cannot soft-delete themselves
  if (id === user_id) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      message: USERS_MESSAGES.CANNOT_DELETE_SELF
    })
  }

  const result = await usersService.deleteUser(id as string)
  if (!result) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  return res.json({
    message: USERS_MESSAGES.DELETE_USER_SUCCESSFUL,
    result
  })
}

/**
 * POST /users/import
 * Bulk import users from an uploaded CSV or Excel file.
 *
 * Expects multipart/form-data with a field named 'file'.
 * Uses formidable (already a project dependency) to parse the file.
 * Delegates row parsing to a helper. Invalid rows are skipped.
 *
 * Returns import summary:
 *   { totalRows, success, failed, errors: [{ row, reason }] }
 *
 * Access: ADMIN only
 */
export const importUsersController = async (req: Request, res: Response, next: NextFunction) => {
  // The file has already been parsed by the upload middleware.
  // req.importRows is set by the middleware after parsing.
  const rows = (req as any).importRows as Record<string, string>[]

  if (!rows || rows.length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: USERS_MESSAGES.IMPORT_FILE_REQUIRED
    })
  }

  const result = await usersService.importUsers(rows)
  return res.json({
    message: USERS_MESSAGES.IMPORT_USERS_SUCCESSFUL,
    result
  })
}
