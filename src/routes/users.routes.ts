import { wrapRequestHandler } from '~/utils/handlers'
import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  getMeController,
  oauthController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updateMeController,
  verifyForgotPasswordController
} from '~/controllers/users.controller'
import {
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordValidator
} from '~/middlewares/users.middleware'

import { accessTokenValidator } from '~/middlewares/validation.middlewares'

const usersRouter = Router()

/**
 * Description: User registration
 * Path: /register
 * Method: POST
 * Body: { username: string, email: string, password: string, confirm_password: string, date_of_birth: string }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: User OAuth with Google
 * Path: /oauth/google
 * Method: GET
 * Body: { }
 */
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))

/**
 * Description: User email verification
 * Path: /verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyController))

/**
 * Description: User resend email verification
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { }
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description: User forgot password
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: User verify forgot password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description: User reset password
 * Path: /reset-password
 * Method: POST
 * Body: { password: string, confirm_password: string, forgot_password_token: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: User me routes
 * Path: /me
 * Method: GET, PATCH
 * Body: { name: string, date_of_birth: string, bio: string, location: string, website: string, username: string, avatar: string, cover_photo: string }
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter
  .route('/me')
  .get(accessTokenValidator, wrapRequestHandler(getMeController))
  .patch(accessTokenValidator, verifiedUserValidator, updateMeValidator, wrapRequestHandler(updateMeController))

export default usersRouter
