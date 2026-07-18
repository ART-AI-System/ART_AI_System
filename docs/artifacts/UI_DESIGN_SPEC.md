# ART-AI: TÀI LIỆU ĐẶC TẢ THIẾT KẾ UI (STUDENT & LECTURER FLOW)

> [!TIP]
> Tài liệu này được biên soạn để Team Backend và Design có thể hình dung rõ ràng toàn bộ kiến trúc giao diện của luồng Sinh Viên và Giảng Viên dựa trên cấu trúc Database 2.0 mới nhất. Hệ thống đã được thiết kế dưới dạng HTML Prototype (Thư mục `mockups/student` và `mockups/lecturer`).

## 1. Hệ thống Thiết kế (Design System)

Hệ thống sử dụng phong cách thiết kế kết hợp giữa sự thực dụng của **FPT EduNext/FAP** và tính thẩm mỹ, hiện đại của **Scholly Dashboard**. 

### Bảng màu (Color Palette)
- **Cam FPT (Primary):** `linear-gradient(135deg, #F26F21, #F79C65)` - Dành cho các nút Nộp bài, Khai báo AI, Logo, Nhấn mạnh điểm nhấn.
- **Xanh Navy Lõi (Dark Theme):** `#1B2559` - Dành cho Text Header, Sidebar của Lecturer.
- **Xanh Dương (Accent):** `#4318FF` - Màu chủ đạo cho các link Navigation đang kích hoạt, Text làm nổi bật.
- **Nền (Background):** Xám nhạt `#F4F7FE`. Các thẻ (Card) có màu Trắng `#FFFFFF`, bo góc mềm mại `24px` và đổ bóng nhẹ (Soft Shadow).
- **Typography:** Sử dụng Font chữ `Inter`.

---

## 2. Bản đồ HTML Prototype (Luồng Sinh Viên - Student Flow)

Toàn bộ HTML tĩnh nằm trong thư mục `mockups/student/`. Điểm nhấn là Top Header chung và cấu trúc Layout hiện đại.

### Nhóm 1: Core Learning (Học tập chính)
1. **[home.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/student/home.html) (Home Dashboard):** 
   - Biểu đồ tần suất học tập y hệt Github Contribution (Các ô vuông cam hiện Tooltip).
   - Lưới thẻ Môn học kèm Ảnh cover, Số Slot, Giảng viên.
2. **[schedule.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/student/schedule.html) (Thời khóa biểu):**
   - Calendar Strip chọn ngày linh hoạt. Vertical Timeline hiển thị các môn học trải dài theo trục dọc thời gian.
3. **[subject_detail.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/student/subject_detail.html) (Chi tiết lớp học):** 
   - Các buổi học (Slot) hiển thị dạng thẻ ngang. Nút "Submit Assignment" nổi bật.
   - Biểu đồ AI Transparency Chart và Donut (Quạt) đo tiến trình lớp học.

### Nhóm 2: Bài tập & Khai báo AI
4. **[submission.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/student/submission.html) (Nộp bài & Khai báo AI):**
   - Trái tim dự án. Luồng nộp bài 2 bước: Step 1 (Upload file) & Step 2 (AI Declaration Form) cho phép khai báo chi tiết prompt/tool đã dùng.

### Nhóm 3: Hệ thống Báo cáo (Reports Hub) - Mới cập nhật
Trên Sidebar, mục Reports được thiết kế dạng **Dropdown Accordion** xổ xuống 5 chức năng quản lý học tập mạnh mẽ như FAP:
5. **[student_attendance.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/student/student_attendance.html) (Attendance Report):**
   - Bảng điểm danh chi tiết từng Slot (Present/Absent). Thẻ Widget cảnh báo Absence Rate (Tỷ lệ vắng mặt quá 20%).
6. **[gradebook.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/student/gradebook.html) (Mark Report):**
   - Bảng điểm chi tiết từng đầu điểm. Cột "AI Transparency" hiển thị tỷ lệ lạm dụng AI.
7. **[student_transcript.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/student/student_transcript.html) (Academic Transcript):**
   - Bảng điểm tổng hợp toàn khóa học. Nhóm theo từng Học kỳ. Biểu đồ đường (Line chart) thể hiện biến động GPA.
8. **[student_curriculum.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/student/student_curriculum.html) (Curriculum):**
   - Khung chương trình đào tạo hiển thị dạng Roadmap trực quan (Từng thẻ màu phân loại: Đã qua, Đang học, Chưa học).
9. **[student_transactions.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/student/student_transactions.html) (Transaction History):**
   - Lịch sử đóng học phí, phí thi lại.

### Nhóm 4: Cá nhân hóa
10. **[settings.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/student/settings.html):** Layout 2 cột (Left Menu + Right Form).
11. **[chat.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/student/chat.html):** Giao diện nhắn tin 2 cột Realtime.

---

## 3. Bản đồ HTML Prototype (Luồng Giảng Viên - Lecturer Flow)

Thư mục `mockups/lecturer/`. Khác với Student, Lecturer sử dụng Sidebar có Background tối (`#1B2559`) để tạo cảm giác quyền lực và phân biệt rõ ràng.

1. **[lecturer_dashboard.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/lecturer/lecturer_dashboard.html):** Màn hình tổng quan tiến độ các lớp.
2. **[lecturer_grading_list.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/lecturer/lecturer_grading_list.html) & [lecturer_grading_detail.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/lecturer/lecturer_grading_detail.html):** Luồng chấm điểm (Grading). Split-pane view cho phép xem bài nộp bên trái và chấm điểm, xác thực AI bên phải.
3. **[lecturer_class_detail.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/lecturer/lecturer_class_detail.html):** Chi tiết lớp học, danh sách sinh viên.
4. **[lecturer_settings.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/lecturer/lecturer_settings.html):** Tương tự sinh viên, dùng Layout 2 cột (Menu & Form) đồng nhất nhưng màu sắc theme tối hơn ở thanh điều hướng.

---
> [!IMPORTANT]
> Toàn bộ các file HTML đã được chuẩn hóa cấu trúc thẻ `<aside>` (Sidebar), `<header>` (Topbar), `<main>` (Content). Các Topbar được thiết kế đồng nhất hiển thị Search, Semester Global (nếu có), Bell Notification và User Profile dạng Avatar (Clickable).
> Team React vui lòng tách các thành phần này ra Component dùng chung.

---

## 4. Bản đồ HTML Prototype (Luồng Quản Trị Viên - Admin Flow)

Thư mục `mockups/admin/`. Dành riêng cho người quản trị cao nhất hệ thống. Sử dụng Background tối `emerald-900` (`#064E3B`) kết hợp cùng các dải màu Xanh lá (Green) để phân biệt rạch ròi với Giảng viên (Xanh Navy) và Sinh viên (Cam).

### Các màn hình lõi:
1. **[admin_dashboard.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/admin/admin_dashboard.html):** Màn hình Overview tổng quan với thống kê số lượng User, Lớp học đang chạy, và Tải hệ thống (System Load).
2. **[admin_users.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/admin/admin_users.html):** Màn hình quản lý User. Admin có thể xem danh sách, đổi Role (Phân quyền Giảng viên / Sinh viên / Subject Head), Khóa tài khoản.
3. **[admin_semesters.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/admin/admin_semesters.html):** Quản lý cấu trúc thời gian (Học kỳ). Cho phép set cờ (flag) cho học kỳ nào đang là `isCurrent` (Học kỳ hiện tại).
4. **[admin_classes.html](file:///e:/FPT/7_SU26/WDP/ART-AI/mockups/admin/admin_classes.html):** Quản lý Danh sách lớp học và nút tính năng quan trọng `Import Excel` danh sách sinh viên. Nút bấm mang tông màu `#16A34A` đặc trưng của Admin.
