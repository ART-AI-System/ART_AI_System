import { ObjectId } from 'mongodb'
import type { StringValue } from 'ms'
import User from '~/models/schemas/users.schema'
import databaseService from '~/services/database.service'
import dotenv from 'dotenv'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType, UserStatus } from '~/constants/enums'
import {
  RegisterReqBody,
  CreateUserReqBody,
  UpdateUserReqBody,
  UpdateUserStatusReqBody,
  UpdateUserRoleReqBody,
  UpdateMeReqBody,
  GetUsersQuery
} from '~/models/requests/users.request'
import { UserRoleType } from '~/models/schemas/users.schema'
import { hashPassword, hashToken } from '~/constants/crypto'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import { USERS_MESSAGES } from '~/constants/messages'
import axios from 'axios'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import path from 'path'
import fs from 'fs'
dotenv.config()

// ==========================================
// CONSTANTS
// ==========================================

const VALID_ROLES: UserRoleType[] = ['STUDENT', 'LECTURER', 'SUBJECT_HEAD', 'ADMIN']

// ==========================================
// SAFE PROJECTION — excludes sensitive fields from user documents
// ==========================================
const SAFE_USER_PROJECTION = {
  password: 0,
  passwordHash: 0
}

class UserService {
  // ==========================================
  // MODULE 1: AUTH PRIVATE HELPERS (preserved)
  // ==========================================

  private signAccessToken({ user_id, role }: { user_id: string; role: UserRoleType }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ACCESS_TOKEN,
        role
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signRefreshToken({ user_id, role, exp }: { user_id: string; role: UserRoleType; exp?: number }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.REFRESH_TOKEN,
          role,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.REFRESH_TOKEN,
        role
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signAccessAndRefreshToken({ user_id, role }: { user_id: string; role: UserRoleType }) {
    return Promise.all([this.signAccessToken({ user_id, role }), this.signRefreshToken({ user_id, role })])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  // signForgotPasswordToken and signEmailVerifyToken are kept for legacy routes on /api/users
  private signForgotPasswordToken({ user_id }: { user_id: string }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.FORGOT_PASSWORD_TOKEN
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  // ==========================================
  // MODULE 1: AUTH SERVICE METHODS (preserved)
  // ==========================================

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const role = (payload.role as any) || 'STUDENT'
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        passwordHash: hashPassword(payload.password),
        role,
        status: UserStatus.ACTIVE,
        isActive: true
      })
    )
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      role
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        userId: new ObjectId(user_id),
        tokenHash: hashToken(refresh_token),
        expiresAt: new Date(exp * 1000),
        iat
      })
    )
    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async login({ user_id, role }: { user_id: string; role: UserRoleType }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      role
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        userId: new ObjectId(user_id),
        tokenHash: hashToken(refresh_token),
        expiresAt: new Date(exp * 1000),
        iat
      })
    )
    return {
      access_token,
      refresh_token
    }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ tokenHash: hashToken(refresh_token) })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESSFUL
    }
  }

  private async getOAuthGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data as {
      access_token: string
      id_token: string
    }
  }

  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        alt: 'json',
        access_token
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }

  async oauthGoogle(code: string) {
    const { id_token, access_token } = await this.getOAuthGoogleToken(code)
    const userInfo = await this.getGoogleUserInfo(access_token, id_token)
    if (!userInfo.verified_email) {
      throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: USERS_MESSAGES.GOOGLE_EMAIL_NOT_VERIFIED })
    }
    const isEmailExists = await databaseService.users.findOne({ email: userInfo.email })
    if (isEmailExists) {
      const role = (isEmailExists as any).role || 'STUDENT'
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
        user_id: isEmailExists._id.toString(),
        role
      })
      const { iat, exp } = await this.decodeRefreshToken(refresh_token)
      await databaseService.refreshTokens.insertOne(
        new RefreshToken({
          userId: isEmailExists._id,
          tokenHash: hashToken(refresh_token),
          expiresAt: new Date(exp * 1000),
          iat
        })
      )
      return {
        access_token,
        refresh_token,
        newUser: 0,
        role
      }
    } else {
      const password = Math.random().toString(36).substring(2, 15)
      const newUser = await this.register({
        fullName: userInfo.name,
        email: userInfo.email,
        password,
        confirm_password: password,
        role: 'STUDENT'
      })
      return { ...newUser, newUser: 1, role: 'STUDENT' }
    }
  }

  async refreshToken({
    user_id,
    role,
    refresh_token,
    exp
  }: {
    user_id: string
    role: UserRoleType
    refresh_token: string
    exp: number
  }) {
    const old_hash = hashToken(refresh_token)
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, role }),
      this.signRefreshToken({ user_id, role, exp }),
      databaseService.refreshTokens.deleteOne({ tokenHash: old_hash })
    ])
    const decoded_refresh_token = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        userId: new ObjectId(user_id),
        tokenHash: hashToken(new_refresh_token),
        expiresAt: new Date(decoded_refresh_token.exp * 1000),
        iat: decoded_refresh_token.iat
      })
    )
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async verifyEmail(user_id: string) {
    // ART-AI không dùng email verify flow nữa.
    // Phương thức này giữ lại để backward compat với users.routes.ts
    return { message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESSFUL }
  }

  async resendVerifyEmail(user_id: string) {
    // ART-AI không dùng email verify flow.
    return { message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESSFUL }
  }

  async forgotPassword({ user_id }: { user_id: string }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id })
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token,
          updated_at: '$$NOW'
        }
      }
    ])
    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password),
          forgot_password_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESSFUL
    }
  }

  // ==========================================
  // MODULE 2: SELF PROFILE METHODS
  // ==========================================

  /**
   * GET /users/me — Returns the current authenticated user's profile.
   * Excludes sensitive fields (password, tokens).
   */
  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      { projection: SAFE_USER_PROJECTION }
    )
    return user
  }

  /**
   * PATCH /users/me — Updates the authenticated user's own profile.
   * Only allows: fullName, profile. Cannot change role/email/password.
   * Returns the updated user document.
   */
  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const allowedFields: Array<keyof UpdateMeReqBody> = ['fullName', 'profile']
    const updateData: Partial<UpdateMeReqBody> = {}
    for (const key of allowedFields) {
      if (payload[key] !== undefined) {
        ;(updateData as any)[key] = payload[key]
      }
    }
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    )
    if (updateData.fullName) {
      await this.syncUserSnapshots(user_id, { fullName: updateData.fullName })
    }
    return await databaseService.users.findOne({ _id: new ObjectId(user_id) }, { projection: SAFE_USER_PROJECTION })
  }

  // ==========================================
  // MODULE 2: ADMIN USER MANAGEMENT METHODS
  // ==========================================

  /**
   * GET /users — Returns a paginated, filterable list of users.
   * Supports: search by fullName/email, filter by role, filter by isActive.
   * Default: page=1, limit=20.
   */
  private async syncUserSnapshots(
    userId: string,
    updates: { fullName?: string; email?: string; studentCode?: string | null; isActive?: boolean }
  ): Promise<void> {
    const userObjectId = new ObjectId(userId)
    const promises: Promise<any>[] = []

    // 1. Sync Lecturer Snapshot in Classes
    if (updates.fullName || updates.email) {
      const lecturerFields: Record<string, string> = {}
      if (updates.fullName) lecturerFields['lecturer.fullName'] = updates.fullName
      if (updates.email) lecturerFields['lecturer.email'] = updates.email
      promises.push(
        databaseService.classes.updateMany(
          { 'lecturer.lecturerId': userObjectId },
          { $set: { ...lecturerFields, updatedAt: new Date() } }
        )
      )
    }

    // 2. Sync Student Snapshot in Classes
    if (updates.fullName || updates.email || updates.studentCode !== undefined) {
      const studentFields: Record<string, any> = {}
      if (updates.fullName) studentFields['students.$[elem].fullName'] = updates.fullName
      if (updates.email) studentFields['students.$[elem].email'] = updates.email
      if (updates.studentCode !== undefined) studentFields['students.$[elem].studentCode'] = updates.studentCode
      
      promises.push(
        databaseService.classes.updateMany(
          { 'students.studentId': userObjectId },
          { $set: { ...studentFields, updatedAt: new Date() } },
          { arrayFilters: [{ 'elem.studentId': userObjectId }] }
        )
      )
    }
    await Promise.all(promises)
  }

  async getUsers(query: GetUsersQuery) {
    const parsedPage = parseInt(query.page || '1', 10)
    const parsedLimit = parseInt(query.limit || '20', 10)
    const page = Math.max(1, isNaN(parsedPage) ? 1 : parsedPage)
    const limit = Math.min(100, Math.max(1, isNaN(parsedLimit) ? 20 : parsedLimit))
    const skip = (page - 1) * limit

    // Build MongoDB filter
    const filter: Record<string, any> = {}

    if (query.role && VALID_ROLES.includes(query.role)) {
      filter.role = query.role
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true'
    }

    if (query.search) {
      const searchRegex = { $regex: query.search, $options: 'i' }
      filter.$or = [{ fullName: searchRegex }, { email: searchRegex }, { studentCode: searchRegex }]
    }

    const [users, total] = await Promise.all([
      databaseService.users
        .find(filter, { projection: SAFE_USER_PROJECTION })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseService.users.countDocuments(filter)
    ])

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * GET /users/:id — Returns a single user by ID.
   * Returns null if not found.
   */
  async getUserById(id: string) {
    if (!ObjectId.isValid(id)) return null
    return databaseService.users.findOne(
      { _id: new ObjectId(id) },
      { projection: SAFE_USER_PROJECTION }
    )
  }

  /**
   * POST /users — Admin creates a new user directly (no email verification flow).
   * Password is hashed before storage.
   */
  async createUser(payload: CreateUserReqBody) {
    const user_id = new ObjectId()
    const newUser = new User({
      _id: user_id,
      fullName: payload.fullName,
      email: payload.email,
      passwordHash: hashPassword(payload.password),
      role: payload.role,
      studentCode: payload.studentCode,
      username: (payload as any).username,
      profile: payload.profile ?? {},
      isActive: true,
      status: UserStatus.ACTIVE
    })

    await databaseService.users.insertOne(newUser)

    return databaseService.users.findOne(
      { _id: user_id },
      { projection: SAFE_USER_PROJECTION }
    )
  }

  /**
   * PUT /users/:id — Admin updates a user's general information.
   * Cannot update email or password via this method.
   * Returns the updated user document.
   */
  async updateUser(id: string, payload: UpdateUserReqBody) {
    if (!ObjectId.isValid(id)) return null
    const allowedFields: Array<keyof UpdateUserReqBody> = ['fullName', 'role', 'studentCode', 'profile']
    const updateData: Record<string, any> = {}
    for (const key of allowedFields) {
      if ((payload as any)[key] !== undefined) {
        updateData[key] = (payload as any)[key]
      }
    }
    const unsetData: Record<string, any> = {}

    if (updateData.role && updateData.role !== 'STUDENT') {
      unsetData.studentCode = ''
      delete updateData.studentCode
    } else if (updateData.studentCode === '') {
      unsetData.studentCode = ''
      delete updateData.studentCode
    }

    const updateQuery: any = { $set: { ...updateData, updatedAt: new Date() } }
    if (Object.keys(unsetData).length > 0) {
      updateQuery.$unset = unsetData
    }

    const result = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateQuery,
      { returnDocument: 'after', projection: SAFE_USER_PROJECTION }
    )
    if (result) {
      await this.syncUserSnapshots(id, {
        fullName: updateData.fullName,
        studentCode: updateData.studentCode
      })
    }
    return result
  }

  /**
   * PATCH /users/:id/status — Admin activates or deactivates a user (soft toggle).
   * Cannot be used on self (enforced at controller level).
   * Returns updated user.
   */
  async updateUserStatus(id: string, isActive: boolean) {
    if (!ObjectId.isValid(id)) return null

    const result = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive,
          updatedAt: new Date()
        }
      },
      {
        returnDocument: 'after',
        projection: SAFE_USER_PROJECTION
      }
    )

    if (result) {
      await this.syncUserSnapshots(id, { isActive })
    }

    return result
  }

  /**
   * PATCH /users/:id/role — Admin changes a user's role.
   * Returns updated user.
   */
  async updateUserRole(id: string, role: UserRoleType) {
    if (!ObjectId.isValid(id)) return null

    const updateOps: any = {
      $set: {
        role,
        updatedAt: new Date()
      }
    }
    if (role !== 'STUDENT') {
      updateOps.$unset = { studentCode: '' }
    }

    const result = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateOps,
      {
        returnDocument: 'after',
        projection: SAFE_USER_PROJECTION
      }
    )

    return result
  }

  /**
   * PATCH /users/:id/reset-password — Admin resets a user's password.
   * Returns updated user (without password).
   */
  async adminResetPassword(id: string, password: string) {
    if (!ObjectId.isValid(id)) return null

    const result = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          passwordHash: hashPassword(password),
          updatedAt: new Date()
        }
      },
      {
        returnDocument: 'after',
        projection: SAFE_USER_PROJECTION
      }
    )

    return result
  }

  /**
   * DELETE /users/:id — Soft delete: sets isActive = false.
   * User record is NEVER physically removed from the database.
   * Cannot be used on self (enforced at controller level).
   */
  async deleteUser(id: string) {
    if (!ObjectId.isValid(id)) return null

    const result = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: false,
          updatedAt: new Date()
        }
      },
      {
        returnDocument: 'after',
        projection: SAFE_USER_PROJECTION
      }
    )

    if (result) {
      await this.syncUserSnapshots(id, { isActive: false })
    }

    return result
  }

  /**
   * POST /users/import — Bulk import users from a parsed CSV/Excel row array.
   *
   * Each row must contain: { fullName, email, password, role, studentCode? }
   *
   * Business rules:
   *   - Skip rows with missing required fields.
   *   - Skip rows with duplicate email (already in DB or within this batch).
   *   - Skip rows with duplicate studentCode (already in DB or within this batch).
   *   - Skip rows with invalid role.
   *   - Continue processing remaining valid rows after skipping.
   *   - Return an import summary with totalRows, success, failed, and errors[].
   */
  async importUsers(rows: Record<string, string>[]): Promise<{
    totalRows: number
    success: number
    failed: number
    errors: Array<{ row: number; reason: string }>
  }> {
    const totalRows = rows.length
    let success = 0
    let failed = 0
    const errors: Array<{ row: number; reason: string }> = []

    // Track emails and studentCodes used in this batch to detect intra-batch duplicates
    const seenEmails = new Set<string>()
    const seenStudentCodes = new Set<string>()

    for (let i = 0; i < rows.length; i++) {
      const rowNumber = i + 1
      const row = rows[i]

      // --- Required field validation ---
      const fullName = (row.fullName || row['Full Name'] || row['full_name'] || '').trim()
      const email = (row.email || row['Email'] || '').trim().toLowerCase()
      const password = (row.password || row['Password'] || '').trim()
      const roleRaw = (row.role || row['Role'] || 'STUDENT').trim().toUpperCase() as UserRoleType
      
      let studentCode = (row.studentCode || row['Student Code'] || row['student_code'] || '').trim() || null
      if (roleRaw !== 'STUDENT') {
        studentCode = null
      }

      if (!fullName) {
        errors.push({ row: rowNumber, reason: 'Missing required field: fullName' })
        failed++
        continue
      }
      if (!email) {
        errors.push({ row: rowNumber, reason: 'Missing required field: email' })
        failed++
        continue
      }
      if (!password) {
        errors.push({ row: rowNumber, reason: 'Missing required field: password' })
        failed++
        continue
      }
      if (!VALID_ROLES.includes(roleRaw)) {
        errors.push({ row: rowNumber, reason: `Invalid role: ${roleRaw}. Must be one of: ${VALID_ROLES.join(', ')}` })
        failed++
        continue
      }

      // --- Intra-batch duplicate detection ---
      if (seenEmails.has(email)) {
        errors.push({ row: rowNumber, reason: `Duplicate email within batch: ${email}` })
        failed++
        continue
      }
      if (studentCode && seenStudentCodes.has(studentCode)) {
        errors.push({ row: rowNumber, reason: `Duplicate studentCode within batch: ${studentCode}` })
        failed++
        continue
      }

      // --- DB duplicate detection ---
      const existingEmail = await databaseService.users.findOne({ email })
      if (existingEmail) {
        errors.push({ row: rowNumber, reason: `Duplicate email: ${email}` })
        failed++
        continue
      }

      if (studentCode) {
        const existingCode = await databaseService.users.findOne({ studentCode })
        if (existingCode) {
          errors.push({ row: rowNumber, reason: `Duplicate studentCode: ${studentCode}` })
          failed++
          continue
        }
      }

      // --- Insert valid row ---
      try {
        const user_id = new ObjectId()
        const newUser = new User({
          _id: user_id,
          fullName,
          email,
          passwordHash: hashPassword(password),
          role: roleRaw,
          studentCode,
          profile: {},
          isActive: true,
          status: UserStatus.ACTIVE
        })

        await databaseService.users.insertOne(newUser)

        // Register in batch tracking sets
        seenEmails.add(email)
        if (studentCode) seenStudentCodes.add(studentCode)
        success++
      } catch (err: any) {
        // Catch any unexpected DB errors (e.g., race condition on unique index)
        const reason = err?.message || 'Unknown error during insert'
        errors.push({ row: rowNumber, reason })
        failed++
      }
    }

    return { totalRows, success, failed, errors }
  }
}

const usersService = new UserService()
export default usersService

