# [PR] Tests & Quizzes Epic - UI Mockups & Schema Updates

## 📋 Tóm tắt (Summary)
Pull Request này bổ sung toàn bộ luồng giao diện người dùng (UI Mockups) và cập nhật Database Schema cho hệ thống **Tests & Quizzes**. Hệ thống giờ đây hỗ trợ đầy đủ luồng nghiệp vụ từ Giảng viên (tạo đề thi, cấu hình hiển thị, xem phân tích điểm) đến Sinh viên (làm bài trong môi trường chống gian lận, xem lại kết quả chi tiết).

Đồng thời PR này cũng sửa lỗi điều hướng Tab trong giao diện Giảng viên và tái cấu trúc Header của trang quản lý môn học (`lecturer_subject_detail.html`).

---

## 🛠️ Những thay đổi chính (Key Changes)

### 1. Database Schema Updates
**Tệp ảnh hưởng:** `docs/ART_AI_DB_SCHEMA_SPEC_REVISED.md`
- Thêm `TestSchema`: Lưu trữ định nghĩa bài thi/quiz, bao gồm mảng câu hỏi (Multiple Choice, Checkbox, True/False), cấu hình thời gian và cấu hình hiển thị kết quả cho sinh viên.
- Thêm `TestAttemptSchema`: Lưu trữ bài làm của sinh viên, bao gồm điểm số, đáp án sinh viên đã chọn và trạng thái nộp bài. Lược đồ này hỗ trợ việc tích hợp trực tiếp vào hệ thống Gradebook.

### 2. Giao diện Giảng viên (Lecturer Mockups)
- **Tích hợp Tab Tests & Quizzes (`lecturer_subject_detail.html`)**:
  - Dọn dẹp lỗi UI bị trùng 2 Header, tích hợp Semester Selector và nút Thông báo vào chung Header xanh Premium.
  - Thêm tab thứ 4 "Tests & Quizzes" để quản lý các bài kiểm tra.
  - Code hoàn chỉnh Modal **Import CSV** cực kỳ trực quan với hướng dẫn định dạng cột.
  - Bổ sung cơ chế lưu trạng thái Tab qua URL Parameter (`?tab=xxx`). Khi người dùng bấm Return từ các trang con, tự động focus về đúng Tab cũ.
- **Tạo Bài Thi (`lecturer_create_test.html`)**: 
  - Giao diện thiết lập cấu hình bài thi (thời gian, điểm, cấu hình công bố kết quả ngay sau khi nộp).
  - Trình dựng câu hỏi (Question Builder) hỗ trợ thêm câu hỏi thủ công.
- **Phân tích Bài Thi (`lecturer_test_analytics.html`)**:
  - Dashboard thống kê trực quan phổ điểm bằng bar chart.
  - Các chỉ số: Tỷ lệ hoàn thành (Completion Rate), Điểm trung bình, Điểm cao nhất, Điểm thấp nhất.
  - Danh sách những câu hỏi sinh viên sai nhiều nhất (Hardest Questions).
  - Bảng danh sách sinh viên kèm điểm số và trạng thái nộp bài chi tiết.

### 3. Giao diện Sinh viên (Student Mockups)
- **Phòng thi "Kín" (`student_take_test.html`)**:
  - Thiết kế UI loại bỏ toàn bộ Sidebar/Navigation không cần thiết, giúp sinh viên tập trung tối đa.
  - Đồng hồ đếm ngược (Countdown Timer) siêu rõ ràng ở góc phải.
  - Cảnh báo **Chống Gian Lận (Anti-Cheat Modal)** khi mới vào trang. Tích hợp Script bắt sự kiện `visibilitychange` để cảnh báo nếu sinh viên cố tình chuyển tab.
  - Question Navigator (Lưới nhảy câu hỏi) trực quan ở thanh bên phải, phân màu câu nào đã làm/chưa làm.
- **Xem Kết quả (`student_test_result.html`)**:
  - Giao diện báo cáo điểm trực quan ngay lập tức sau khi nộp bài.
  - Hiển thị lại toàn bộ đề bài nhưng ở chế độ Read-only.
  - Tuỳ theo setting của Giảng viên, tô màu Xanh/Đỏ cho các câu hỏi và các Option để sinh viên đối chiếu xem mình đúng/sai ở đâu.

### 4. Sửa lỗi Giao diện khác (Bug Fixes)
- Sửa lỗi Navigation Sidebar bị thiếu các mục (Reports, News, Messages, Settings) trên một số trang nội bộ.
- Chuẩn hóa nút "Back" trên mọi màn hình chi tiết (Class, Edit Slot, Create Assignment) bằng một biểu tượng hình tròn đồng nhất, và trỏ đúng về tab hiện tại.

---

## 📸 Ảnh chụp / Minh chứng (Screenshots)
*(Chèn ảnh chụp màn hình các trang mockups mới vào đây trước khi tạo PR)*

## ⚠️ Cần Review
- Team Backend cần review lại 2 Schema (`TestSchema` và `TestAttemptSchema`) xem đã đủ trường dữ liệu để móc nối với hệ thống Gradebook chưa.
- Cần chốt lại cơ chế import câu hỏi bằng CSV (Backend có cần file mẫu cụ thể để parse hay không).

---
**Tạo bởi:** *ART-AI Development Assistant*
