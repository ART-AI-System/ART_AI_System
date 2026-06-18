**Tiêu đề PR (Title):**
feat(module-6): implement Score and Grading Management APIs

**Mô tả PR (Body):**

## Mô tả (Description)
Pull Request này bổ sung **Module 6: Score & Grading Management**, cho phép Giảng viên chấm điểm chi tiết cho từng bài nộp (Submission) và hệ thống tự động tổng kết kết quả học tập (Final Result) cuối kỳ cho Sinh viên.

## Những thay đổi chính (Key Changes)
- **Database Schemas:**
  - `grades.schema.ts`: Lưu thông tin điểm số từng cột điểm của sinh viên.
  - `finalResults.schema.ts`: Lưu bảng điểm tổng kết và xếp loại (Classification: poor, average, good, very_good, excellent).
- **Services (`grades.service.ts`):**
  - Khởi tạo hàm `gradeSubmission` (Upsert điểm).
  - Tự động lấy trọng số (weight) từ GradeItems để tính điểm trung bình môn qua hàm `calculateFinalResult`.
- **Controllers & Routes:**
  - `/api/submissions/:id/grade`: Chấm điểm.
  - `/api/classes/:classId/grades` & `/api/grade-items/:gradeItemId/grades`: Báo cáo bảng điểm.
  - `/api/classes/:classId/students/:studentId/final-result`: Kích hoạt tính toán điểm chung cuộc.

## Kế hoạch kiểm thử (Verification Plan)
- [x] Pass Typescript Compiler (`npx tsc --noEmit`).
- [x] Triển khai theo chuẩn Native MongoDB Driver (loại bỏ Mongoose).
- [ ] Chờ tích hợp Module 4 (Nộp bài/Submission) để test E2E qua Postman.

## Ghi chú cho Reviewer (Reviewer Notes)
- Endpoint tính điểm Final Result yêu cầu gửi kèm `classId` và `studentId`.
- Do giới hạn chưa có đủ các Schema liên đới ở Module 1 & 4 nên phần Authorization Middleware (RBAC) chưa được mount vào Route. Sẽ xử lý ở lần ghép code tổng.
