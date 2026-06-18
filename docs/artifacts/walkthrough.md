# Tổng kết luồng UI Giảng Viên (Lecturer)

Dưới đây là các bản Mockup giao diện mới được bổ sung nhằm hoàn thiện toàn bộ luồng nghiệp vụ của Giảng viên. 

---

## 1. Tái cấu trúc & Sửa lỗi Navigation
- **Top Header**: Thiết kế lại toàn bộ Profile Giảng viên (Avatar + Tên) đặt ở góc phải Top Header (giống với thiết kế của Sinh viên).
- **Sidebar**: Gỡ bỏ khung User Profile & Logout bị thừa ở góc dưới cùng của Sidebar để tránh trùng lặp. Giữ Sidebar gọn gàng tập trung vào điều hướng Menu.

---

## 2. Quản lý Báo cáo Điểm (Reports)
**File**: `mockups/lecturer/lecturer_reports.html`

> [!NOTE]
> Trang này là nơi duy nhất Giảng viên sử dụng để tổng hợp, điều chỉnh lần cuối và nộp điểm về cho hệ thống quản lý.

- **Khu vực Bộ lọc (Filters)**: Cho phép chọn nhanh Subject và Class.
- **Thanh công cụ (Toolbar)**:
  - Nút **Import CSV**: Dành cho các giảng viên chấm điểm ngoài và muốn đưa điểm lên hệ thống.
  - Nút **Export Excel**: Tải bảng điểm hiện tại về máy tính.
  - Nút **Send to Head of Subject** (Màu cam nổi bật): Sau khi hoàn thành, giảng viên sẽ bấm nút này để khóa bảng điểm và gửi đi.
- **Bảng điểm (Gradebook)**:
  - Cấu trúc: Cột tên sinh viên cố định (sticky) khi cuộn ngang. Các cột điểm thành phần với tỷ trọng (Weight %) tương ứng.
  - Cột cuối cùng "Total" tự động tính tổng điểm.
- **Tính năng Chỉnh sửa Điểm Chặt chẽ**:
  - Khi trỏ chuột vào một ô điểm, nút `Edit` sẽ hiện ra.
  - Bấm `Edit` sẽ mở Modal yêu cầu nhập số điểm mới **kèm theo Lý do (Reason / Note)**.
  - Nếu không điền Note, hệ thống **không cho phép Save**. Các ô điểm đã bị chỉnh sửa thủ công sẽ có đánh dấu sao (`*`) và hiện Tooltip ghi rõ lý do.

---

## 3. Quản lý Tin nhắn (Messages)
**File**: `mockups/lecturer/lecturer_messages.html`

- Thiết kế 2 cột: Danh sách hội thoại bên trái và Khung chat bên phải.
- Hỗ trợ gửi ảnh, đính kèm file tài liệu (ví dụ: gửi rubric chấm điểm dạng PDF trực tiếp qua khung chat).
- Thể hiện rõ các trạng thái: Đang online, tin nhắn chưa đọc (unread badge), tin nhắn đã gửi thành công / đã xem.

---

## 4. Cài đặt Tài khoản (Settings)
**File**: `mockups/lecturer/lecturer_settings.html`

- Giao diện chia thành các block quản lý rõ ràng:
  - **Personal Information**: Xem thông tin cá nhân.
  - **Security**: Cho phép đổi mật khẩu.
  - **Log Out**: Nút đăng xuất đỏ nổi bật ở cuối trang. Nút này khi bấm sẽ điều hướng thẳng về màn hình `login.html`.
