// ==========================================
// ART-AI System Enums
// ==========================================
// Quy tắc:
//   - UserRole dùng UPPERCASE trong DB và source code (backward compat)
//   - Khi trả về response FE, map sang lowercase nếu cần
//   - UserVerifyStatus đã bị xóa — không còn email verify flow trong ART-AI
// ==========================================

/**
 * Loại token JWT được sử dụng trong hệ thống.
 */
export enum TokenType {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  FORGOT_PASSWORD_TOKEN // dùng cho reset password flow
}

/**
 * Role người dùng trong hệ thống ART-AI.
 * Lưu UPPERCASE trong DB để tương thích với dữ liệu cũ.
 * Khi trả về response, map sang lowercase.
 */
export enum UserRole {
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  SUBJECT_HEAD = 'SUBJECT_HEAD',
  ADMIN = 'ADMIN'
}

/**
 * Trạng thái tài khoản người dùng.
 * active            — tài khoản bình thường
 * inactive          — bị deactivate bởi Admin
 * pending_activation — tạo tự động qua import, chưa đặt password
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_ACTIVATION = 'pending_activation'
}
