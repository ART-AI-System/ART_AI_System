**Tiêu đề PR (Title):**
feat: integrate RBAC into Module 3 and Module 6 APIs

**Mô tả PR (Body):**

## Mô tả (Description)
Pull Request này giải quyết yêu cầu Tích hợp hệ thống Authentication & Authorization (RBAC) do Chủ dự án mới đẩy lên nhánh `main`.

Nhánh này hợp nhất code của `main`, `module-3`, và `module-6`, xử lý triệt để các Merge Conflicts tại `src/index.ts`, đồng thời gắn lớp bảo vệ Role-Based Access Control cho toàn bộ các Endpoints nghiệp vụ.

## Những thay đổi chính (Key Changes)
- Áp dụng `requireAuth` và `requireRole` từ thư mục `src/middlewares/` vào toàn bộ Route của Cấu trúc Học tập (Classes, Grade Items) và Quản lý Chấm điểm (Grades, Final Results).
- **Phân quyền chi tiết (RBAC Mapping):**
  - **Classes:** Tạo/Xóa lớp chỉ dành cho `ADMIN` và `SUBJECT_HEAD`. Giảng viên `LECTURER` chỉ được cập nhật lớp mình dạy.
  - **Grade Items:** Tạo/Sửa/Xóa cấu trúc điểm chỉ được thực hiện bởi `LECTURER`.
  - **Grades:** Chỉ `LECTURER` được phép chấm điểm (POST/PUT), xóa điểm, và bấm nút Tổng kết điểm `final-result`. Sinh viên `STUDENT` bị chặn (403 Forbidden) đối với các thao tác này nhưng vẫn có thể xem điểm của mình (GET).

## Kế hoạch kiểm thử (Verification Plan)
- [x] Pass Typescript Compiler (`npx tsc --noEmit`).
- [x] Test E2E Authorization: Verify 401 cho lỗi Token, 403 cho lỗi sai Role.

## Ghi chú cho Reviewer (Reviewer Notes)
- `UserRole` enum đã được chuyển sang sử dụng uppercase (`'STUDENT'`, `'LECTURER'`, `'ADMIN'`) để match chuẩn xác định nghĩa Schema ban đầu.
