# Lecturer Reports, Messages, and Settings

## Mục tiêu (Goal)
Hoàn thiện các luồng giao diện còn thiếu của Giảng viên (Lecturer), bao gồm:
1. Luồng Báo cáo điểm (Grading Report).
2. Tin nhắn (Messages/Chat).
3. Cài đặt tài khoản (Settings) và đăng xuất.
4. Sửa lỗi hiển thị thừa (logout/settings) trên trang News.

## User Review Required
- **Report Flow**: Bạn muốn trang Report (`lecturer_report.html`) là một trang riêng biệt trên Sidebar, hay là một chức năng nằm bên trong trang "Grading" / "My Subjects"? Tôi đề xuất tạo một trang **Reports** riêng (có icon trên Sidebar), trong đó Giảng viên chọn Môn -> Chọn Lớp -> Hiện ra bảng điểm tổng hợp (Gradebook) của lớp đó. Trong bảng này có nút chỉnh sửa điểm kèm ghi chú, và nút "Send to Head of Subject". Bạn có đồng ý với luồng này không?
- **Messages**: Thiết kế tương tự như trang Chat của sinh viên nhưng áp dụng Sidebar màu tối (Dark theme) của Giảng viên.
- **Settings**: Giao diện thiết lập tài khoản, đổi mật khẩu, cấu hình thông báo. Nút Logout sẽ được đặt ở đây (hoặc Header) cho chuẩn xác, khắc phục lỗi hiển thị 2 nơi.

## Proposed Changes

### 1. Sửa lỗi Sidebar & Top Header
- **[MODIFY] `mockups/lecturer/lecturer_news.html`**:
  - Xóa phần `<div class="p-6 border-t border-white/10">` (User Profile chứa avatar và nút Logout) ở dưới cùng của Sidebar để tránh trùng lặp với menu Settings. Thay vào đó, tích hợp Avatar và Profile lên góc phải của Top Header (giống cách làm của luồng sinh viên).
  - Cập nhật lại Top Header của tất cả các trang Lecturer để đồng nhất việc đặt Avatar Profile và nút Logout ở góc phải trên cùng. (Tôi sẽ dùng Script/Component hoặc sửa tay một số trang chính).

### 2. Trang Báo cáo điểm (Reports)
**Giải đáp:** Nút "Reports" hiện tại trên Sidebar chính là nơi để phục vụ luồng này! Khi Giảng viên bấm vào đây, hệ thống sẽ mở ra trang Quản lý báo cáo điểm tổng hợp.

- **[NEW] `mockups/lecturer/lecturer_reports.html`**:
  - **Khu vực lọc/chọn**: Dropdown để chọn Subject (Môn học) -> Chọn Class (Lớp).
  - **Thanh công cụ (Toolbar)**: Khi đã chọn được lớp, sẽ hiển thị các nút thao tác chính:
    - `Upload File (Import)`: Nạp file CSV điểm tổng hợp.
    - `Export CSV`: Xuất bảng điểm hiện tại ra máy.
    - `Send to Head of Subject`: Gửi báo cáo điểm cuối kỳ lên cho Trưởng môn duyệt. Nút này có thể có trạng thái (Ví dụ: "Đã gửi", "Chờ duyệt").
  - **Màn hình bảng điểm (Gradebook View)**: Hiển thị danh sách sinh viên với tất cả các cột điểm thành phần và điểm tổng kết.
  - **Chỉnh sửa điểm (Edit Grade)**: Nút Edit nhỏ cạnh từng đầu điểm. Khi bấm sẽ hiện một Modal (Popup). Trong Modal này:
    - Nhập điểm mới.
    - **Bắt buộc** nhập Note/Lý do (Ví dụ: "Bonus điểm phát biểu", "Sửa do chấm nhầm"). Nếu không nhập Note, nút Save sẽ bị vô hiệu hóa.

### 3. Trang Tin nhắn (Messages)
- **[NEW] `mockups/lecturer/lecturer_messages.html`**:
  - Bố cục 2 cột: Cột trái danh sách các cuộc hội thoại (với sinh viên, nhóm lớp, hoặc Head of Subject). Cột phải là khung chat chi tiết.
  - Hỗ trợ gửi file/ảnh.

### 4. Trang Cài đặt (Settings)
- **[NEW] `mockups/lecturer/lecturer_settings.html`**:
  - Giao diện quản lý thông tin cá nhân (Profile).
  - Đổi mật khẩu.
  - Nút **Log out** nổi bật (sẽ liên kết về trang `auth/login.html`).

## Verification Plan
- Chạy Live Server và click thử từng liên kết trên Sidebar của Lecturer.
- Kiểm tra tính đồng nhất của Top Header và Sidebar trên các trang mới.
- Đảm bảo luồng "Sửa điểm -> Bắt buộc nhập Note" hiển thị rõ ràng thông qua UI State (ví dụ Modal Sửa điểm).
