## Tổng quan
Pull Request này hoàn thiện toàn bộ các API Backend cho module Quizzes/Tests và các thay đổi về Giao diện (UI) cho Admin/Login thuộc nhiệm vụ của **Mem 36**. 

### 💡 Có gì mới & Điểm khác biệt so với Tài liệu gốc (Specs)

Sau khi đối chiếu kỹ lưỡng giữa UI Mockups và API Specs ban đầu, đội ngũ đã chủ động bổ sung thêm một số logic ở tầng Backend để hỗ trợ hoàn toàn các chức năng trên Frontend mà không cần phải cắt giảm bất kỳ giao diện nào:

**1. API Bài thi & Trắc nghiệm (Tests & Quizzes - Backend):**
- **Test Schema & Test Attempts Schema**: Bổ sung schema hoàn chỉnh để xử lý các câu hỏi trắc nghiệm (1 đáp án / nhiều đáp án), giấu đáp án đúng để sinh viên không thể xem trộm qua trình duyệt, tính điểm và lưu vết gian lận.
- **Cơ chế Chấm điểm Tự động (Auto-grading)**: API `/submit` nay đã tự động tính toán và trả về điểm số dựa trên bộ đáp án gốc do Giảng viên cài đặt.
- **Giáo viên Ghi đè Điểm thủ công (`PATCH /api/test-attempts/:attemptId/override-score`)**: Bổ sung theo yêu cầu thực tế, cho phép Giảng viên được quyền chỉnh sửa (override) điểm số tự động của hệ thống nếu cần.
- **Đồng bộ Sổ Điểm (`POST /api/tests/:testId/export-grades`)**: Bổ sung theo yêu cầu thực tế. API này cho phép đẩy trực tiếp toàn bộ điểm số của một bài thi sang hệ thống Gradebook (Sổ điểm cốt lõi).
- **Cơ chế chống thi hộ/gian lận (`POST /api/tests/:testId/cheat`)**: Bổ sung theo yêu cầu thực tế. Backend hiện cung cấp endpoint để đếm số lần sinh viên vi phạm (chuyển tab, thu nhỏ màn hình). *Lưu ý: Đội Frontend cần viết thêm sự kiện `visibilitychange` hoặc dùng `Fullscreen API` để gọi API này.*

**2. Nâng cấp Giao diện Mockup (Frontend):**
- **Luồng Đăng nhập (`login.html`)**: Chuyển đổi thành luồng 2 bước (Chọn Campus -> Chọn Role). Chia làm **4 luồng Role riêng biệt** (Student, Lecturer, Head Subject, Admin). Bổ sung tính năng "Cửa hậu" (Backdoor): Bấm trực tiếp vào Logo FPT Education để gọi form đăng nhập của Admin.
- **Admin Dashboard (`admin_dashboard.html`)**: Thiết kế lại hoàn toàn dựa trên mẫu thiết kế mới với bố cục mang tính phân tích cao: bao gồm 4 Thẻ chỉ số (Top Cards), Biểu đồ Cột (Bar Chart), Biểu đồ Tròn (Donut Chart), và danh sách sinh viên/thông báo.
- **Admin Sidebar**: Xóa bỏ các thanh menu bị trùng lặp, chuẩn hóa sang tông màu xanh lá chủ đạo (`#16A34A`), đổi `Teachers` thành menu dạng Dropdown `Employees`, và hoàn thiện các mục Settings/Messages/Feedback/Logout.
- **Giao tiếp & Phản hồi (`admin_messages.html`, `admin_feedback.html`)**: Tạo mới hoàn toàn 2 file HTML mockup để hỗ trợ hệ thống nhắn tin nội bộ và tiếp nhận báo cáo lỗi/góp ý từ người dùng.

### Chi tiết các thay đổi trong Code
- Cập nhật `database.service.ts` để Index tự động các Collection mới.
- Tạo mới các schema: `tests.schema.ts`, `testAttempts.schema.ts`.
- Tạo mới logic API: `tests.service.ts`, `tests.controllers.ts`, `tests.routes.ts` & tích hợp router vào `index.ts`.
- Cập nhật script `generate_admin_mockups.py` và render lại toàn bộ file giao diện Admin.
- Viết lại logic tương tác trong `login.html`.
