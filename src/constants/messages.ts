export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'User validation failed',
  LOGIN_SUCCESSFUL: 'Login successfully',
  LOGIN_FAILED: 'Login failed',
  REGISTER_SUCCESSFUL: 'Register successful',
  REGISTER_FAILED: 'Register failed',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password is incorrect',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100_CHARACTERS: 'Name length must be from 1 to 100 characters',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_ALREADY_IN_USE: 'Email is already in use!',
  EMAIL_IS_INVALID: 'Email is invalid',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50_CHARACTERS: 'Password length must be from 6 to 50 characters',
  PASSWORD_NOT_STRONG_ENOUGH:
    'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORDS_DOES_NOT_MATCH: 'Confirm password does not match password do not match',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be in ISO 8601 format',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  LOGOUT_FAILED: 'Logout failed',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  USED_REFRESH_TOKEN_OR_NOT_EXISTS: 'Used refresh token or not exists',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_SUCCESSFUL: 'Refresh token successful',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED: 'Email has already been verified',
  EMAIL_VERIFY_SUCCESSFUL: 'Email verification successful',
  RESEND_EMAIL_VERIFY_SUCCESSFUL: 'Resend email verification successful',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_IS_INVALID: 'Forgot password token is invalid',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Please check your email to reset your password',
  VERIFY_FORGOT_PASSWORD_SUCCESSFUL: 'Verify forgot password successful',
  RESET_PASSWORD_SUCCESSFUL: 'Reset password successful',
  GET_ME_SUCCESSFUL: 'Get user profile successful',
  UPDATE_ME_SUCCESSFUL: 'Update user profile successful',
  USER_NOT_VERIFIED: 'User not verified',
  LOCATION_MUST_BE_STRING: 'Location must be a string',
  LOCATION_LENGTH_MUST_BE_FROM_1_TO_100_CHARACTERS: 'Location length must be from 1 to 100 characters',
  BIO_MUST_BE_STRING: 'Bio must be a string',
  BIO_LENGTH_MUST_BE_FROM_1_TO_200_CHARACTERS: 'Bio length must be from 1 to 200 characters',
  WEBSITE_MUST_BE_STRING: 'Website must be a string',
  WEBSITE_LENGTH_MUST_BE_FROM_1_TO_200_CHARACTERS: 'Website length must be from 1 to 200 characters',
  USERNAME_MUST_BE_STRING: 'Username must be a string',
  USERNAME_LENGTH_MUST_BE_FROM_1_TO_50_CHARACTERS: 'Username length must be from 1 to 50 characters',
  IMAGE_URL_MUST_BE_STRING: 'Image URL must be a string',
  IMAGE_URL_LENGTH_MUST_BE_FROM_1_TO_400_CHARACTERS: 'Image URL length must be from 1 to 400 characters',
  GOOGLE_EMAIL_NOT_VERIFIED: 'Google account email is not verified',
  UPLOAD_IMAGE_SUCCESSFUL: 'Upload image successful',
  UPLOAD_VIDEO_SUCCESSFUL: 'Upload video successful',
  UPLOAD_VIDEO_HLS_SUCCESSFUL: 'Upload video HLS successful',
  GET_VIDEO_STATUS_SUCCESSFUL: 'Get video status successful',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',

  // ==========================================
  // MODULE 1: AUTHENTICATION MESSAGES (ART-AI)
  // ==========================================

  // Register Student
  REGISTER_STUDENT_SUCCESSFUL: 'Student registered successfully',
  STUDENT_CODE_IS_REQUIRED: 'Student code is required',
  STUDENT_CODE_IS_INVALID: 'Student code must be a string between 1 and 20 characters',

  // Login
  STUDENT_CODE_OR_PASSWORD_INCORRECT: 'Student code or password is incorrect',
  USERNAME_OR_PASSWORD_INCORRECT: 'Username or password is incorrect',
  ACCOUNT_INACTIVE: 'Your account has been deactivated. Please contact administrator.',
  INVALID_LOGIN_CREDENTIALS: 'Invalid credentials. Please provide studentCode or username with password.',
  STUDENT_CANNOT_LOGIN_WITH_USERNAME: 'Students must login with studentCode, not username',
  STAFF_CANNOT_LOGIN_WITH_STUDENT_CODE: 'Staff accounts must login with username, not studentCode',

  // Username
  USERNAME_IS_REQUIRED: 'Username is required',
  USERNAME_IS_INVALID: 'Username must be a string between 1 and 50 characters',

  // Forgot Password
  FORGOT_PASSWORD_SUCCESSFUL: 'If an account with that email exists, a password reset link has been sent',

  // Reset Password
  RESET_TOKEN_IS_REQUIRED: 'Reset token is required',
  RESET_TOKEN_IS_INVALID: 'Reset token is invalid or has expired',
  RESET_TOKEN_ALREADY_USED: 'Reset token has already been used',
  RESET_TOKEN_EXPIRED: 'Reset token has expired',

  // Change Password
  CHANGE_PASSWORD_SUCCESSFUL: 'Password changed successfully',
  OLD_PASSWORD_IS_REQUIRED: 'Old password is required',
  OLD_PASSWORD_IS_INCORRECT: 'Old password is incorrect',
  NEW_PASSWORD_IS_REQUIRED: 'New password is required',
  NEW_PASSWORD_SAME_AS_OLD: 'New password must be different from old password',

  // ==========================================
  // MODULE 2: USER MANAGEMENT MESSAGES
  // ==========================================

  // User CRUD
  GET_USERS_SUCCESSFUL: 'Get users successful',
  GET_USER_SUCCESSFUL: 'Get user successful',
  CREATE_USER_SUCCESSFUL: 'Create user successful',
  UPDATE_USER_SUCCESSFUL: 'Update user successful',
  DELETE_USER_SUCCESSFUL: 'User deleted (deactivated) successfully',

  // Status & Role
  UPDATE_USER_STATUS_SUCCESSFUL: 'Update user status successful',
  UPDATE_USER_ROLE_SUCCESSFUL: 'Update user role successful',
  IS_ACTIVE_IS_REQUIRED: 'isActive is required',
  IS_ACTIVE_MUST_BE_BOOLEAN: 'isActive must be a boolean',
  ROLE_IS_REQUIRED: 'Role is required',
  ROLE_IS_INVALID: 'Role must be STUDENT, LECTURER, SUBJECT_HEAD, or ADMIN',
  CANNOT_CHANGE_OWN_STATUS: 'Admins cannot change their own status',
  CANNOT_DELETE_SELF: 'Admins cannot delete themselves',

  // Student Code
  STUDENT_CODE_ALREADY_IN_USE: 'Student code is already in use',
  STUDENT_CODE_MUST_BE_STRING: 'Student code must be a string',
  STUDENT_CODE_IS_REQUIRED_FOR_STUDENT: 'Student code is required for STUDENT role',
  STUDENT_CODE_LENGTH: 'Student code must be between 1 and 20 characters',

  // Import
  IMPORT_USERS_SUCCESSFUL: 'Import users completed',
  IMPORT_FILE_REQUIRED: 'Import file is required',
  IMPORT_INVALID_FILE_TYPE: 'File must be a CSV or Excel file (.csv, .xlsx, .xls)',

  // Field validations
  FULL_NAME_IS_REQUIRED: 'Full name is required',
  FULL_NAME_MUST_BE_STRING: 'Full name must be a string',
  FULL_NAME_LENGTH: 'Full name must be between 1 and 100 characters',
  EMAIL_IS_REQUIRED_FOR_CREATE: 'Email is required',
  PASSWORD_IS_REQUIRED_FOR_CREATE: 'Password is required for user creation'
} as const
