# Báo cáo Tiến độ (Changelog) - Nhóm ART-AI

Dưới đây là tổng hợp toàn bộ các tính năng đã được phát triển, kiểm thử và tích hợp thành công vào nhánh `main` trong Phase 1 & 2.

## 1. Module 3: Quản lý Cấu trúc Học thuật (Academic Structure)
- **Classes (Lớp học):** 
  - Khởi tạo Schema `classes` theo chuẩn tham chiếu MongoDB.
  - Viết đầy đủ bộ API CRUD (Tạo, Xem, Sửa).
  - Tích hợp thành công middleware bắt lỗi tự động `wrapRequestHandler`.
- **Grade Items (Cột điểm):**
  - Khởi tạo Schema `grade_items` dùng để định nghĩa các đầu điểm (VD: Proposal, Final Report) kèm theo trọng số (weight).
  - Phát triển API nested routes: Cho phép truy vấn tất cả cột điểm của một lớp học cụ thể `GET /classes/:classId/grade-items`.

## 2. Module 6: Quản lý Điểm số & Tổng kết (Grading & Final Results)
- **Submissions Grading (Chấm điểm):**
  - Khởi tạo Schema `grades`.
  - Viết logic Upsert (Update/Insert) thông minh: Giảng viên chỉ cần gọi 1 API `POST /submissions/:id/grade`, hệ thống tự phát hiện nếu đã chấm rồi thì sẽ cập nhật điểm mới.
- **Final Results (Chốt điểm Cuối kỳ):**
  - Khởi tạo Schema `final_results`.
  - Viết thuật toán `calculateFinalResult`: Tự động quét toàn bộ điểm của sinh viên trong một lớp, nhân với trọng số (weight) của từng cột điểm, ra được điểm tổng kết (Final Score).
  - Tự động phân loại Học lực (POOR, AVERAGE, GOOD, VERY_GOOD, EXCELLENT) dựa trên thang điểm 10.

## 3. Tích hợp Bảo mật & Phân quyền (RBAC Integration)
Toàn bộ các API của Module 3 và Module 6 đã được gắn lớp khiên bảo mật dựa trên Token do Module 1 cung cấp:
- Đảm bảo 100% Request gửi đến phải có `Authorization: Bearer <Token>`.
- Phân quyền chặt chẽ từng nghiệp vụ:
  - Sinh viên chỉ được quyền xem (Read-only), bị chặn hoàn toàn (403 Forbidden) khỏi các thao tác tạo/sửa/xóa lớp và tự chấm điểm.
  - Giảng viên được cấp đặc quyền tạo cấu trúc điểm, chấm điểm bài nộp và gọi thuật toán chốt điểm cuối kỳ.

## 4. Tối ưu hóa Database & Hệ thống
- Áp dụng Singleton Pattern cho `DatabaseService`.
- Sửa lỗi Connection String: Xử lý mã hóa `encodeURIComponent` cho các ký tự đặc biệt trong Mật khẩu MongoDB, giúp kết nối Cloud Atlas ổn định 100%.

> **Trạng thái:** Sẵn sàng nghiệm thu (Ready for Production Testing).
