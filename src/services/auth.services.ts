import { ObjectId } from 'mongodb'
import type { StringValue } from 'ms'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { hashPassword } from '~/constants/crypto'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import databaseService from '~/services/database.service'
import { signToken, verifyToken } from '~/utils/jwt'
import dotenv from 'dotenv'
dotenv.config()

// ==========================================
// Tầng Service xử lý toàn bộ logic nghiệp vụ xác thực (Authentication).
// Tuân thủ nguyên tắc:
//   - Không truy cập trực tiếp HTTP layer (req/res).
//   - Mọi thao tác DB thực hiện qua databaseService (Native MongoDB Driver).
//   - Refresh Token được cập nhật theo Immutable Operations:
//     delete bản cũ + insert bản mới (không dùng $set).
//   - Secret keys luôn đọc từ process.env, không hardcode.
// ==========================================

class AuthService {
  // ==========================================
  // PRIVATE: Token signing helpers
  // ==========================================

  /**
   * Ký Access Token.
   * Payload: { user_id, token_type: ACCESS_TOKEN, verify }
   * Expiry: ACCESS_TOKEN_EXPIRES_IN từ environment variable.
   */
  private signAccessToken({
    user_id,
    verify
  }: {
    user_id: string
    verify: UserVerifyStatus
  }): Promise<string> {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ACCESS_TOKEN,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  /**
   * Có hai chế độ:
   *   1. Ký mới từ đầu (không truyền exp): sử dụng expiresIn từ env.
   *   2. Ký lại với exp cố định (truyền exp): dùng khi rotate refresh token
   *      để giữ nguyên thời gian hết hạn ban đầu, tránh kéo dài thêm session.
   *
   * Immutable Rotation: khi rotate, refresh token mới có cùng exp với token cũ.
   * Đây là cơ chế bảo mật quan trọng: attacker không thể kéo dài phiên vô hạn.
   */
  private signRefreshToken({
    user_id,
    verify,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    exp?: number
  }): Promise<string> {
    if (exp !== undefined) {
      // Chế độ rotate: nhúng trực tiếp exp vào payload thay vì dùng expiresIn.
      // Lý do: khi exp đã được nhúng vào payload, jwt.sign sẽ ưu tiên nó
      // hơn options.expiresIn. Đây là cách duy nhất giữ nguyên exp gốc.
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.REFRESH_TOKEN,
          verify,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }

    // Chế độ tạo mới: sử dụng expiresIn từ env.
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.REFRESH_TOKEN,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  /**
   * Ký đồng thời cặp [Access Token, Refresh Token] bằng Promise.all
   * để tối ưu hiệu năng (song song, không tuần tự).
   */
  private signAccessAndRefreshToken({
    user_id,
    verify
  }: {
    user_id: string
    verify: UserVerifyStatus
  }): Promise<[string, string]> {
    return Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify })
    ])
  }

  /**
   * Giải mã Refresh Token để lấy payload (iat, exp).
   * Được dùng sau khi ký để trích xuất iat/exp lưu vào DB.
   */
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  // ==========================================
  // PUBLIC: Business Logic Methods
  // ==========================================

  /**
   * Luồng:
   *   1. Tìm user theo email trên DB. Nếu không tồn tại → 401.
   *   2. So sánh mật khẩu bằng hashPassword(password) với giá trị trong DB.
   *      Nếu không khớp → 401 EMAIL_OR_PASSWORD_INCORRECT.
   *      (Tầng validation middleware có thể đã check, nhưng service tự kiểm
   *       tra độc lập để bảo đảm tính correct khi gọi service trực tiếp.)
   *   3. Ký cặp [access_token, refresh_token] song song.
   *   4. Giải mã refresh_token để lấy iat và exp.
   *   5. Lưu refresh_token vào DB (collection refreshTokens).
   *   6. Trả về { access_token, refresh_token }.
   *
   * Quyết định thiết kế:
   *   - Nhận user_id và verify thay vì nhận toàn bộ object User,
   *     giữ cho interface service gọn gàng, dễ test, dễ mock.
   *   - loginValidator trong middleware đã gắn req.user, controller
   *     truyền user_id và verify xuống, không cần tái truy vấn DB.
   *
   * @param user_id - ObjectId string của user đã được xác thực.
   * @param verify  - Trạng thái verify email của user.
   */
  async login({
    user_id,
    verify
  }: {
    user_id: string
    verify: UserVerifyStatus
  }): Promise<{ access_token: string; refresh_token: string }> {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify
    })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token,
        iat,
        exp
      })
    )

    return {
      access_token,
      refresh_token
    }
  }

  /**
   * Luồng:
   *   1. Xóa document refresh_token khỏi collection refreshTokens theo field token.
   *   2. Trả về message xác nhận.
   *
   * Bảo mật:
   *   - Refreshe Token Validator đã xác thực token hợp lệ và còn trong DB
   *     trước khi controller gọi service này.
   *   - Xóa token khỏi DB đảm bảo token không thể dùng lại sau khi logout
   *     (chống lại refresh token replay attack).
   *
   * @param refresh_token - Refresh token cần revoke.
   */
  async logout(refresh_token: string): Promise<{ message: string }> {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })

    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESSFUL
    }
  }

  /**
   * Cơ chế Immutable Rotation:
   *   - Ký refresh token mới với exp GIỐNG HỆT token cũ (không kéo dài thêm).
   *   - Xóa token cũ và insert token mới trong một chuỗi operation song song.
   *   - Kết quả: attacker không thể dùng token cũ sau rotation,
   *     và session không bị kéo dài vô hạn qua việc rotate liên tục.
   *
   * Luồng chi tiết:
   *   1. Song song:
   *      a. Ký access_token mới.
   *      b. Ký refresh_token mới với exp từ token cũ (immutable expiry).
   *      c. Xóa refresh_token cũ khỏi DB.
   *   2. Giải mã refresh_token cũ để lấy iat gốc (iat không đổi qua rotation).
   *   3. Insert refresh_token mới vào DB với iat gốc và exp gốc.
   *   4. Trả về cặp token mới.
   *
   * Lưu ý: decodeRefreshToken(refresh_token) dùng token CŨ (đã có trong tham số)
   * để lấy iat gốc. Token cũ đã được xác thực ở tầng middleware trước đó.
   *
   * @param user_id       - ID của user.
   * @param verify        - Trạng thái verify của user.
   * @param refresh_token - Refresh token CŨ cần rotate.
   * @param exp           - Thời điểm hết hạn của token cũ (Unix timestamp).
   */
  async refreshToken({
    user_id,
    verify,
    refresh_token,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    refresh_token: string
    exp: number
  }): Promise<{ access_token: string; refresh_token: string }> {
    // Thực hiện ba operation song song để tối ưu hiệu năng:
    // - Ký access_token mới
    // - Ký refresh_token mới với exp cố định (immutable rotation)
    // - Xóa refresh_token cũ khỏi DB (revoke ngay khi rotation bắt đầu)
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify, exp }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])

    // Lấy iat từ token CŨ để bảo toàn thời điểm phát hành ban đầu.
    // iat (issued at) không nên thay đổi qua các lần rotation.
    const decoded_old_refresh_token = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: new_refresh_token,
        iat: decoded_old_refresh_token.iat,
        exp: decoded_old_refresh_token.exp
      })
    )

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  /**
   * Kiểm tra email có tồn tại trong hệ thống không.
   * Dùng để validate trước khi login nếu cần tách logic check email.
   *
   * @param email - Địa chỉ email cần kiểm tra.
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  /**
   * Tìm user theo email và mật khẩu đã hash.
   * Dùng bởi loginValidator để xác thực thông tin đăng nhập.
   * Trả về null nếu không tìm thấy (email sai hoặc password sai).
   *
   * @param email    - Địa chỉ email.
   * @param password - Mật khẩu thô (chưa hash), hàm này tự hash trước khi query.
   */
  async findUserByEmailAndPassword(email: string, password: string) {
    const user = await databaseService.users.findOne({
      email,
      password: hashPassword(password)
    })

    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    return user
  }
}

const authService = new AuthService()
export default authService
