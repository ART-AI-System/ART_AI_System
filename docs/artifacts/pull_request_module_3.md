**Tiêu đề PR (Title):**
feat(module-3): implement Academic Structure (Classes & Grade Items) schemas and core APIs

**Mô tả PR (Body):**

## Mô tả (Description)
Pull Request này khởi tạo toàn bộ bộ khung cốt lõi cho **Module 3: Academic Structure Management**, sử dụng Native MongoDB Driver theo đúng kiến trúc của dự án. Module này cung cấp nền tảng quản lý Lớp học và các Cột điểm, là tiền đề để triển khai Module 6 (Chấm điểm) và Module 4 (Nộp bài) sau này.

## Những thay đổi chính (Key Changes)
- **Database Schemas:**
  - `classes.schema.ts`: Định nghĩa Class entity, nhúng thông tin `LecturerSnapshot` và `StudentSnapshot`.
  - `gradeItems.schema.ts`: Định nghĩa GradeItem entity (trọng số điểm, số lượng câu prompt bắt buộc...).
- **Services:**
  - Cập nhật `database.service.ts` để kết nối collection `classes` và `grade_items`.
  - Xây dựng tầng Logic `classes.service.ts` & `gradeItems.service.ts`.
- **Controllers & Routes (RESTful API):**
  - CRUD API cho Classes (`/api/classes`).
  - CRUD API cho Grade Items (`/api/classes/:classId/grade-items` và `/api/grade-items`).

## Kế hoạch kiểm thử (Verification Plan)
- [x] Đã verify cú pháp thông qua TypeScript Compiler (`tsc --noEmit`).
- [x] Đã khai báo thành công các Model bằng Native Mongo Driver thay vì Mongoose.
- [ ] Endpoint cần được test kĩ qua Postman khi Database Atlas có đủ Mock Data của User (sẽ test tích hợp sau khi ghép Module 1).

## Ghi chú cho Reviewer (Reviewer Notes)
- Module này hiện chưa ghim Auth Middleware do cần đợi Module 1 hoàn thiện. Sẽ bổ sung RBAC (chỉ Lecturer được phép dùng) ở bản cập nhật tích hợp.
