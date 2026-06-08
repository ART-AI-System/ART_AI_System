import { NextFunction, Request, Response } from 'express'
import { checkSchema, ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/users.request'
import databaseService from '~/services/database.service'
import usersService from '~/services/users.service'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

// ==========================================
// REUSABLE RULE FACTORIES
// ==========================================

const emailRules = (): ParamSchema => ({
  notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
  isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
  trim: true
})

const passwordRules = (defaultMessage = USERS_MESSAGES.PASSWORD_NOT_STRONG_ENOUGH): ParamSchema => ({
  notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
  isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING },
  isLength: {
    options: { min: 6, max: 50 },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50_CHARACTERS
  },
  isStrongPassword: {
    options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }
  },
  errorMessage: defaultMessage
})

const textRules = (min: number, max: number, reqMsg: string, lenMsg: string, isOptional = false): ParamSchema => ({
  optional: isOptional ? true : undefined,
  notEmpty: isOptional ? undefined : { errorMessage: reqMsg },
  isString: { errorMessage: reqMsg.replace('required', 'must be a string') },
  isLength: { options: { min, max }, errorMessage: lenMsg },
  trim: true
})

// ==========================================
// SHARED SCHEMAS
// ==========================================

const fullNameSchema = textRules(1, 100, USERS_MESSAGES.NAME_IS_REQUIRED, USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100_CHARACTERS)

const confirmPasswordSchema: ParamSchema = {
  ...passwordRules(),
  notEmpty: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) throw new Error(USERS_MESSAGES.CONFIRM_PASSWORDS_DOES_NOT_MATCH)
      return true
    }
  }
}

const forgotPasswordTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) throw new ErrorWithStatus({ message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED, status: HTTP_STATUS.UNAUTHORIZED })
      try {
        const decoded_forgot_password_token = await verifyToken({
          token: value,
          secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
        })
        const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_forgot_password_token.user_id) })
        if (!user) throw new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.UNAUTHORIZED })
        if (user.forgot_password_token !== value) throw new ErrorWithStatus({ message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID, status: HTTP_STATUS.UNAUTHORIZED })
        req.decoded_forgot_password_token = decoded_forgot_password_token
      } catch (error) {
        throw error instanceof JsonWebTokenError
          ? new ErrorWithStatus({ message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID, status: HTTP_STATUS.UNAUTHORIZED })
          : error
      }
      return true
    }
  }
}

// Shared role schema used by both createUser and updateUserRole validators
const roleSchema: ParamSchema = {
  notEmpty: { errorMessage: USERS_MESSAGES.ROLE_IS_REQUIRED },
  isIn: {
    options: [['STUDENT', 'LECTURER', 'SUBJECT_HEAD', 'ADMIN']],
    errorMessage: USERS_MESSAGES.ROLE_IS_INVALID
  }
}

// ==========================================
// MODULE 1 EXPORTED VALIDATORS (preserved for backward compatibility)
// ==========================================

export const registerValidator = validate(
  checkSchema({
    fullName: fullNameSchema,
    email: {
      ...emailRules(),
      custom: {
        options: async (value) => {
          if (await usersService.checkEmailExists(value)) throw new Error(USERS_MESSAGES.EMAIL_ALREADY_IN_USE)
          return true
        }
      }
    },
    password: passwordRules(),
    confirm_password: confirmPasswordSchema,
    role: {
      optional: true,
      isIn: {
        options: [['STUDENT', 'LECTURER', 'SUBJECT_HEAD', 'ADMIN']],
        errorMessage: 'Role must be STUDENT, LECTURER, SUBJECT_HEAD, or ADMIN'
      }
    }
  }, ['body'])
)

export const emailVerifyTokenValidator = validate(
  checkSchema({
    email_verify_token: {
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          if (!value) throw new ErrorWithStatus({ message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED, status: HTTP_STATUS.UNAUTHORIZED })
          try {
            req.decoded_email_verify_token = await verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string })
            return true
          } catch (error) {
            throw error instanceof JsonWebTokenError
              ? new ErrorWithStatus({ message: capitalize(error.message), status: HTTP_STATUS.UNAUTHORIZED })
              : error
          }
        }
      }
    }
  }, ['body'])
)

export const forgotPasswordValidator = validate(
  checkSchema({
    email: {
      ...emailRules(),
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value })
          if (!user) throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
          req.user = user
          return true
        }
      }
    }
  }, ['body'])
)

export const verifyForgotPasswordValidator = validate(checkSchema({ forgot_password_token: forgotPasswordTokenSchema }, ['body']))

export const resetPasswordValidator = validate(
  checkSchema({
    password: passwordRules(),
    confirm_password: confirmPasswordSchema,
    forgot_password_token: forgotPasswordTokenSchema
  }, ['body'])
)

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  if ((req.decoded_auth as TokenPayload).verify !== UserVerifyStatus.VERIFIED) {
    return next(new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_VERIFIED, status: HTTP_STATUS.FORBIDDEN }))
  }
  next()
}

export const requireAuthValidator = (validator: (req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) return validator(req, res, next)
    next()
  }
}

// ==========================================
// MODULE 2: USER MANAGEMENT VALIDATORS
// ==========================================

/**
 * PATCH /users/me — Self profile update validator.
 * All fields optional. At least one field expected.
 */
export const updateMeValidator = validate(
  checkSchema({
    fullName: {
      optional: true,
      isString: { errorMessage: USERS_MESSAGES.FULL_NAME_MUST_BE_STRING },
      isLength: { options: { min: 1, max: 100 }, errorMessage: USERS_MESSAGES.FULL_NAME_LENGTH },
      trim: true
    },
    profile: {
      optional: true,
      isObject: { errorMessage: 'Profile must be an object' }
    }
  }, ['body'])
)

/**
 * POST /users — Admin creates a user.
 *
 * Validation rules:
 *   - fullName: required, string, 1-100 chars
 *   - email: required, valid email format, not already registered
 *   - password: required, strong password
 *   - role: required, one of valid roles
 *   - studentCode: optional; must be unique if provided
 *   - profile: optional object
 */
export const createUserValidator = validate(
  checkSchema({
    fullName: fullNameSchema,
    email: {
      ...emailRules(),
      custom: {
        options: async (value: string) => {
          if (await usersService.checkEmailExists(value)) {
            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_IN_USE)
          }
          return true
        }
      }
    },
    password: passwordRules(),
    role: roleSchema,
    studentCode: {
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          const role = req.body.role
          const normalizedValue = value ? value.trim() : ''
          if (role === 'STUDENT') {
            if (!normalizedValue) throw new Error(USERS_MESSAGES.STUDENT_CODE_IS_REQUIRED_FOR_STUDENT)
            if (normalizedValue.length < 1 || normalizedValue.length > 20) throw new Error(USERS_MESSAGES.STUDENT_CODE_LENGTH)
            const existing = await databaseService.users.findOne({ studentCode: normalizedValue })
            if (existing) throw new Error(USERS_MESSAGES.STUDENT_CODE_ALREADY_IN_USE)
            req.body.studentCode = normalizedValue
          } else {
            req.body.studentCode = null
          }
          return true
        }
      }
    },
    profile: {
      optional: true,
      isObject: { errorMessage: 'Profile must be an object' }
    }
  }, ['body'])
)

/**
 * PUT /users/:id — Admin updates a user's general info.
 *
 * Validation rules:
 *   - All fields optional (partial update)
 *   - role: must be a valid role if provided
 *   - studentCode: must be unique across users (excluding the current user) if provided
 *   - profile: must be an object if provided
 */
export const updateUserValidator = validate(
  checkSchema({
    id: {
      in: ['params'],
      custom: {
        options: async (value: string) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
          }
          const user = await databaseService.users.findOne({ _id: new ObjectId(value) })
          if (!user) {
            throw new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
          }
          return true
        }
      }
    },
    fullName: {
      optional: true,
      isString: { errorMessage: USERS_MESSAGES.FULL_NAME_MUST_BE_STRING },
      isLength: { options: { min: 1, max: 100 }, errorMessage: USERS_MESSAGES.FULL_NAME_LENGTH },
      trim: true
    },
    role: {
      optional: true,
      isIn: {
        options: [['STUDENT', 'LECTURER', 'SUBJECT_HEAD', 'ADMIN']],
        errorMessage: USERS_MESSAGES.ROLE_IS_INVALID
      }
    },
    studentCode: {
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          const targetId = req.params?.id
          let role = req.body.role
          if (!role) {
            const user = await databaseService.users.findOne({ _id: new ObjectId(targetId) })
            role = user?.role
          }
          const normalizedValue = value ? value.trim() : ''
          if (role === 'STUDENT') {
            if (value === undefined) {
              const user = await databaseService.users.findOne({ _id: new ObjectId(targetId) })
              if (!user || !user.studentCode) {
                throw new Error(USERS_MESSAGES.STUDENT_CODE_IS_REQUIRED_FOR_STUDENT)
              }
              return true
            }
            if (!normalizedValue) throw new Error(USERS_MESSAGES.STUDENT_CODE_IS_REQUIRED_FOR_STUDENT)
            if (normalizedValue.length < 1 || normalizedValue.length > 20) throw new Error(USERS_MESSAGES.STUDENT_CODE_LENGTH)
            const existing = await databaseService.users.findOne({ studentCode: normalizedValue })
            if (existing && existing._id.toString() !== targetId) {
              throw new Error(USERS_MESSAGES.STUDENT_CODE_ALREADY_IN_USE)
            }
            req.body.studentCode = normalizedValue
          } else {
            req.body.studentCode = null
          }
          return true
        }
      }
    },
    profile: {
      optional: true,
      isObject: { errorMessage: 'Profile must be an object' }
    }
  }, ['body', 'params'])
)

/**
 * PATCH /users/:id/status — Admin toggles isActive.
 *
 * Validation rules:
 *   - isActive: required, must be boolean
 */
export const updateUserStatusValidator = validate(
  checkSchema({
    id: {
      in: ['params'],
      custom: {
        options: async (value: string) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
          }
          const user = await databaseService.users.findOne({ _id: new ObjectId(value) })
          if (!user) {
            throw new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
          }
          return true
        }
      }
    },
    isActive: {
      notEmpty: { errorMessage: USERS_MESSAGES.IS_ACTIVE_IS_REQUIRED },
      isBoolean: { errorMessage: USERS_MESSAGES.IS_ACTIVE_MUST_BE_BOOLEAN },
      toBoolean: true
    }
  }, ['body', 'params'])
)

/**
 * PATCH /users/:id/role — Admin changes user role.
 *
 * Validation rules:
 *   - role: required, must be a valid role
 */
export const updateUserRoleValidator = validate(
  checkSchema({
    id: {
      in: ['params'],
      custom: {
        options: async (value: string) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
          }
          const user = await databaseService.users.findOne({ _id: new ObjectId(value) })
          if (!user) {
            throw new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
          }
          return true
        }
      }
    },
    role: roleSchema
  }, ['body', 'params'])
)