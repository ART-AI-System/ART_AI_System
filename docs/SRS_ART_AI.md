# Tài liệu Đặc tả Yêu cầu Phần mềm (SRS)
## Dự án: ART-AI (Academic Research Transparency & AI Audit System)
### Hệ thống Giám sát Minh bạch và Kiểm chứng Nhật ký AI trong Nghiên cứu Khoa học

---

## 1. Giới thiệu (Introduction)

### 1.1. Mục đích
Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) này xác định các yêu cầu chức năng và phi chức năng cho hệ thống **ART-AI**. Tài liệu này được thiết kế để làm tài liệu tham khảo chính thức cho nhóm phát triển backend (sử dụng NodeJS, ExpressJS, TypeScript) và frontend (ReactJS), đảm bảo sự đồng bộ về mặt nghiệp vụ giữa các thành viên.

### 1.2. Triết lý cốt lõi của ART-AI
Trong thời đại trí tuệ nhân tạo (Generative AI) phát triển vượt bậc, việc cấm sinh viên sử dụng AI trong nghiên cứu khoa học và học tập là không thực tế. ART-AI ra đời với triết lý **"Minh bạch thay vì cấm đoán"**. 

* **Hệ thống tập trung vào việc đánh giá**:
  * Cách sinh viên tương tác với AI (Prompt Quality).
  * Khả năng tư duy phản biện khi tiếp nhận câu trả lời từ AI (Critical Thinking & Student Decision).
  * Mức độ tự đánh giá và nhận thức sâu sắc về nội dung (Reflection).
  * Mức độ phụ thuộc vào AI (AI Dependency).
* **Hệ thống nói KHÔNG với**:
  * Các thuật toán phát hiện văn bản do AI tạo ra (AI-generated text detector) mang tính xác suất thiếu chính xác.
  * Các hệ thống kiểm tra đạo văn thông thường (Plagiarism check - như Turnitin).
  * Điểm số phần trăm AI tạo ra từ tài liệu nộp.
  * *Tập tài liệu nộp bài chỉ được coi là sản phẩm nghiên cứu cuối cùng (Academic Deliverable).*

### 1.3. Phạm vi hệ thống
Hệ thống là một ứng dụng Web (Web Application) quản lý quy trình nộp báo cáo nghiên cứu của sinh viên theo từng cột điểm trong Syllabus lớp học, tích hợp nhật ký khai báo sử dụng AI chi tiết cho từng giai đoạn và cơ chế phân tích, đánh giá, gắn cờ cảnh báo của hệ thống cùng giảng viên.

### 1.4. Thuật ngữ & Viết tắt
* **RBAC (Role-Based Access Control)**: Kiểm soát truy cập dựa trên vai trò.
* **Audit Log (AI Audit Log)**: Nhật ký kiểm chứng sử dụng AI.
* **Grade Item**: Cột điểm / Mốc đánh giá của môn học (ví dụ: Slot 5, Slot 10...).
* **Submission**: Bài nộp của sinh viên cho một cột điểm cụ thể.
* **AI Interaction**: Một lượt tương tác giữa sinh viên và AI (gồm Prompt, Response, Decision, Reflection).
* **AI Evaluation**: Đánh giá tự động của hệ thống về hành vi tương tác AI.
* **Flag (Submission Flag)**: Cờ cảnh báo hành vi nghi vấn hoặc bất thường trong sử dụng AI.
* **Reflection**: Phần viết phản biện, tự giải trình của sinh viên về tính đúng đắn và đóng góp của AI trong bài viết.

---

## 2. Mô tả Tổng quan (Overall Description)

### 2.1. Đối tượng sử dụng và Phân quyền (User Roles & RBAC)
Hệ thống gồm 4 vai trò người dùng chính được phân quyền nghiêm ngặt:

1. **Sinh viên (Student)**:
   * Xem danh sách lớp học mình tham gia.
   * Xem thời hạn và yêu cầu của các cột điểm (Grade Items).
   * Tạo bài nộp nháp (Draft), chỉnh sửa bài nộp, và nộp bài chính thức.
   * Khai báo nhật ký sử dụng AI (AI Interactions) liên kết với bài nộp (từ 5 đến 10 tương tác).
   * Xem điểm số, nhận xét của giảng viên, xếp hạng của bản thân.
   * Xem Dashboard phân tích xu hướng sử dụng AI cá nhân.

2. **Giảng viên (Lecturer)**:
   * Tạo và quản lý lớp học. Thêm sinh viên vào lớp (thủ công hoặc import từ Excel).
   * Cấu hình các cột điểm (Grade Items), trọng số điểm (Weight), và cấu hình yêu cầu số lượng nhật ký AI tối thiểu/tối đa.
   * Đánh giá chi tiết bài nộp của sinh viên: Xem tệp tin, xem Nhật ký sử dụng AI chi tiết, xem Đánh giá tự động của hệ thống.
   * So sánh nội dung giữa các phiên bản nháp (Text Diffing) để kiểm soát tiến trình viết bài.
   * Gắn cờ cảnh báo (Flagging) và giải quyết các cờ cảnh báo (Resolve Flags).
   * Nhập điểm (Grade) và phản hồi (Feedback) cho bài nộp.
   * Xem bảng điểm lớp học, thống kê xếp loại học sinh, biểu đồ phân phối sử dụng AI.
   * Tính toán điểm tổng kết (Final Result) của cả lớp.

3. **Chủ nhiệm bộ môn (Subject Head)**:
   * Xem báo cáo tổng quát của toàn bộ lớp học thuộc bộ môn quản lý.
   * Theo dõi các trường hợp vi phạm liêm chính học thuật quy mô lớn (danh sách bài nộp bị gắn cờ mức độ HIGH).
   * Xem biểu đồ xu hướng sử dụng AI theo học kỳ hoặc theo môn học của cả bộ môn.
   * Xuất báo cáo tổng kết điểm số và xếp loại của toàn bộ các lớp.

4. **Quản trị viên (Admin)**:
   * Quản lý người dùng (CRUD Users, kích hoạt/vô hiệu hóa tài khoản).
   * Import danh sách người dùng hệ thống.
   * Giám sát các chỉ số hoạt động hệ thống trên Admin Dashboard.

### 2.2. Môi trường vận hành (Operating Environment)
* **Frontend**: Chạy trên các trình duyệt web hiện đại (Chrome, Edge, Firefox, Safari) hỗ trợ HTML5/CSS3 và Javascript/ES6+.
* **Backend**: Môi trường NodeJS (phiên bản >= 18).
* **Database**: MongoDB (phiên bản >= 6.0).

---

## 3. Các Tính năng Hệ thống Chi tiết (System Features)

Hệ thống được chia làm 12 Module chức năng cốt lõi. Trong đó, Module 1 đến Module 9 là nhóm tính năng cơ bản bắt buộc của quy trình quản lý học thuật; Module 10 đến Module 12 là nhóm tính năng nâng cao phục vụ việc Audit AI.

```
+-------------------------------------------------------------------------+
|                                  ART-AI                                 |
+-------------------------------------------------------------------------+
| [Module 1: Auth]         [Module 2: Users]       [Module 3: Classes/GIs]|
| [Module 4: Submissions]  [Module 5: Reviews]     [Module 6: Grading]    |
| [Module 7: Final Result] [Module 8: Classify]    [Module 9: Reports]    |
| [Module 10: AI Declara]  [Module 11: AI Eval]    [Module 12: Flags]     |
+-------------------------------------------------------------------------+
```

### Module 1: Xác thực tài khoản (Authentication)
* **Login**: Cho phép người dùng đăng nhập bằng Email và Password, hoặc đăng nhập thông qua bên thứ ba (Google OAuth2).
* **Logout**: Hủy bỏ phiên đăng nhập, thu hồi (revoke) refresh token.
* **Refresh Token**: Sử dụng cơ chế Refresh Token lưu tại database để cấp lại Access Token mới khi hết hạn (hạn dùng Access Token: 15 phút, Refresh Token: 100 ngày).

### Module 2: Quản lý Người dùng (User Management)
* **Thông tin cá nhân**: Người dùng tự cập nhật thông tin (Họ tên, mật khẩu, profile cá nhân).
* **CRUD Người dùng (Admin)**: Quản trị viên có quyền thêm mới, sửa đổi, vô hiệu hóa (deactivate) tài khoản người dùng, thay đổi vai trò (Role).
* **Import Người dùng (Admin)**: Cho phép import hàng loạt danh sách sinh viên/giảng viên thông qua tệp tin Excel/CSV.

### Module 3: Quản lý Lớp học & Cột điểm (Academic Structure Management)
* **Quản lý lớp học (Class Management)**: Giảng viên có quyền tạo lớp, chỉnh sửa hoặc xóa lớp học. Lớp học chứa mã lớp (classCode), tên môn học, học kỳ (semester), năm học và danh sách sinh viên.
* **Cơ chế Snapshot**: Để tăng tốc độ truy vấn chi tiết lớp học, thông tin của Giảng viên và danh sách Sinh viên được lưu dưới dạng Snapshot nhúng trực tiếp trong document của Class (không dùng cơ chế join `$lookup` liên tục trong MongoDB). Giảng viên và Sinh viên khi cập nhật thông tin cá nhân sẽ kích hoạt quy trình cập nhật đồng bộ các snapshot liên quan ở service layer.
* **Import Sinh viên vào lớp**: Giảng viên có thể import danh sách sinh viên trực tiếp vào lớp thông qua file Excel/CSV.
* **Quản lý cột điểm (Grade Items)**: Các mốc nộp bài bám sát Syllabus (ví dụ: Slot 5 - Proposal, Slot 10 - Lit Review...). Mỗi Grade Item có trọng số điểm (Weight - từ 0% đến 100%), điểm tối đa (maxScore), hạn nộp (deadline), và cấu hình bắt buộc khai báo nhật ký AI (minAiInteractions, maxAiInteractions).

### Module 4: Nộp bài & Quản lý phiên bản (Assignment Submission Management)
* **Nộp bài (Submit)**: Sinh viên upload tệp tin bài làm lên hệ thống. Tệp tin được đẩy lên Object Storage (MinIO hoặc S3), MongoDB chỉ lưu metadata (fileName, fileStorageKey, fileSize, mimeType, contentHash).
* **Các định dạng hỗ trợ**: PDF, DOCX, XLSX, PPTX, ZIP (giới hạn dung lượng <= 10MB).
* **Quản lý phiên bản (Proof of Work / Versioning)**: Mỗi lần sinh viên lưu nháp (Save Draft) hoặc nộp bài mới (Submit), hệ thống sẽ tăng chỉ số phiên bản (`versionNumber`) và tạo một bản ghi mới trong Collection `submissions`. Bản ghi cũ sẽ được set `isLatest = false`. Điều này giúp hệ thống lưu giữ toàn bộ vết chỉnh sửa của sinh viên.

### Module 5: Giảng viên Nhận xét & Đánh giá (Lecturer Review)
* **Danh sách tổng quan**: Giảng viên xem trạng thái nộp bài của cả lớp cho từng cột điểm.
* **Đánh giá chi tiết (Review)**: Giảng viên xem nội dung bài làm, duyệt nhật ký AI của sinh viên, xem phân tích hệ thống.
* **Cập nhật trạng thái đánh giá**: Giảng viên chuyển đổi trạng thái của Submission:
  * `PENDING`: Chưa đánh giá.
  * `REVIEWED`: Đã đánh giá (hợp lệ).
  * `NEEDS_REVISION`: Yêu cầu sinh viên chỉnh sửa và nộp lại phiên bản mới.
  * `FLAGGED`: Bị gắn cờ nghi vấn liêm chính (chuyển sang Module 12).
* **Nhận xét (Comment)**: Giảng viên viết bình luận chi tiết phản hồi bài làm.

### Module 6: Chấm điểm bài nộp (Score & Grading)
* **Nhập điểm (Grade)**: Giảng viên chấm điểm số (từ 0 đến maxScore) và ghi nhận xét đánh giá tổng quan về tính minh bạch sử dụng AI cho từng Submission.
* **Cập nhật điểm**: Cho phép giảng viên sửa đổi điểm chấm khi cần thiết, ghi nhận lại thời gian và người sửa điểm.
* **Tra cứu điểm**: Sinh viên tra cứu điểm số của các cột điểm đã được chấm. Giảng viên xem bảng điểm tổng hợp của cả lớp.

### Module 7: Quản lý Kết quả Cuối cùng (Final Result Management)
* **Tính điểm tổng kết**: Hệ thống tự động tính điểm tổng kết (`finalScore`) của sinh viên trong một lớp dựa trên công thức nhân trọng số:
  $$FinalScore = \sum_{i=1}^{n} (Score_i \times Weight_i)$$
  *Yêu cầu*: Tổng trọng số của tất cả các cột điểm (Grade Items) trong lớp phải bằng 100% để đảm bảo tính đúng đắn.
* **Xem & Kết xuất**: Cho phép giảng viên và chủ nhiệm bộ môn xem bảng điểm tổng kết và xuất ra file Excel/PDF/CSV. Sinh viên xem kết quả điểm tổng kết cá nhân.

### Module 8: Xếp loại Học lực & Thứ hạng (Academic Classification)
* **Xếp loại học lực**: Dựa trên điểm tổng kết, hệ thống phân loại sinh viên vào các nhóm:
  * `POOR` (Yếu/Kém): Điểm từ `0.0` đến `4.9`.
  * `AVERAGE` (Trung bình): Điểm từ `5.0` đến `6.4`.
  * `GOOD` (Khá): Điểm từ `6.5` đến `7.9`.
  * `VERY_GOOD` (Giỏi): Điểm từ `8.0` đến `8.9`.
  * `EXCELLENT` (Xuất sắc): Điểm từ `9.0` đến `10.0`.
* **Xếp hạng (Ranking)**: Hệ thống tính toán thứ hạng (Rank) của sinh viên trong lớp học dựa trên điểm tổng kết giảm dần.

### Module 9: Báo cáo & Dashboard phân tích (Reporting & Dashboard)
* **Dashboard Sinh viên**: Thống kê số bài đã nộp, bài còn nợ, điểm trung bình hiện tại, biểu đồ hình bánh về công cụ AI thường dùng, số lượng cờ (Flags) bị gắn.
* **Dashboard Giảng viên**: Thống kê tổng số lớp, số sinh viên, số bài đang chờ đánh giá (PENDING), danh sách bài bị gắn cờ, biểu đồ phân bổ điểm số của lớp, phân bổ xếp loại.
* **Dashboard Chủ nhiệm bộ môn**: Báo cáo tổng thể về số lượng lớp học của bộ môn, biểu đồ xu hướng sử dụng AI của toàn bộ môn học, danh sách các trường hợp phụ thuộc AI nghiêm trọng (High Dependency).
* **Xuất báo cáo (Export)**: Kết xuất bảng điểm tổng hợp, kết quả xếp loại, xếp hạng dưới định dạng Excel, PDF và CSV.

### Module 10: Khai báo Nhật ký AI (AI Usage Declaration)
* **Khai báo tương tác (AI Interaction Logging)**: Sinh viên khai báo các lượt hỏi đáp với AI tương ứng với từng cột điểm bài nộp.
* **Cấu hình số lượng**: Số lượng tương tác bắt buộc từ 5 đến 10 tương tác.
* **Cấu trúc một bản tương tác**:
  * **Công cụ AI (aiTool)**: `chatgpt`, `gemini`, `claude`, `copilot`, hoặc `other`.
  * **Mục đích sử dụng (usagePurpose)**: `brainstorming`, `topic_research`, `summarization`, `writing_improvement`, `critical_feedback`, `methodology_review`, `data_analysis`, hoặc `other`.
  * **Câu lệnh gửi đi (promptContent)**: Nội dung chi tiết câu lệnh sinh viên dùng.
  * **Phản hồi của AI (aiResponse)**: Nội dung đầy đủ câu trả lời của AI.
  * **Quyết định của sinh viên (studentDecision)**: `accepted` (Chấp nhận toàn bộ), `partially_accepted` (Chấp nhận một phần), `rejected` (Từ chối sử dụng), hoặc `reference_only` (Chỉ dùng làm tài liệu tham khảo).
  * **Giải trình phản biện (reflectionText)**: Sinh viên tự giải trình lý do đưa ra quyết định, cách họ kiểm chứng thông tin AI đưa ra, đóng góp của họ trong việc chỉnh sửa thông tin đó.

### Module 11: Đánh giá Tự động Nhật ký AI (AI Usage Evaluation)
* **Phân tích hành vi tương tác**: Sau khi sinh viên nộp bài kèm nhật ký AI, hệ thống tự động đánh giá hành vi sử dụng AI trên 4 tiêu chí cốt lõi (điểm số từ 0 - 100):
  1. **Prompt Quality (Chất lượng Câu lệnh)**: Đánh giá độ dài, từ khóa chuyên sâu và cấu trúc câu lệnh.
  2. **Reflection Quality (Chất lượng Phản biện)**: Đánh giá độ sâu của văn bản phản biện, tính khách quan và kiểm chứng thông tin.
  3. **Critical Thinking (Tư duy Phản biện)**: Xem xét tỷ lệ quyết định (Decision) của sinh viên (ví dụ: nếu sinh viên luôn chọn `accepted` 100% không chỉnh sửa, điểm tư duy phản biện sẽ bị đánh giá thấp).
  4. **AI Dependency (Độ phụ thuộc AI)**: Phân tích mức độ dựa dẫm vào kết quả của AI.
* **Xác định mẫu hình sử dụng AI (AI Usage Pattern)**:
  * `CRITICAL_ENGAGEMENT` (Tương tác Phản biện sâu sắc): Điểm tư duy và phản biện cao, dùng AI làm trợ lý để phản biện ý tưởng.
  * `COLLABORATIVE_USAGE` (Hợp tác hiệu quả): Phối hợp nhịp nhàng giữa người và AI, có chỉnh sửa nội dung.
  * `PASSIVE_USAGE` (Sử dụng Thụ động): Chấp nhận hầu hết câu trả lời từ AI, viết giải trình sơ sài.
  * `HIGH_DEPENDENCY` (Phụ thuộc nghiêm trọng): Chép nguyên văn câu trả lời AI, không phản biện, không kiểm chứng.
* **Xác định mức độ rủi ro liêm chính (Risk Level)**: `low`, `medium`, `high`.

### Module 12: Quản lý Cờ cảnh báo (Flag Management)
* **Tự động gắn cờ (System Flagging)**: Hệ thống tự động quét và gắn cờ cảnh báo đối với các hành vi nghi ngờ vi phạm quy chế học thuật:
  * `missing_ai_interactions`: Sinh viên nộp bài nhưng không đính kèm nhật ký tương tác AI (khi cột điểm yêu cầu bắt buộc).
  * `low_quality_prompt`: Các câu lệnh quá ngắn, hời hợt kiểu "viết cho tôi đoạn văn này...".
  * `weak_reflection`: Bài phản biện quá ngắn (dưới số lượng từ quy định) hoặc rập khuôn.
  * `all_responses_accepted`: Chấp nhận 100% tất cả kết quả của AI mà không từ chối hay chỉnh sửa gì.
  * `high_ai_dependency`: Điểm phụ thuộc AI vượt quá ngưỡng cho phép.
  * `suspicious_declaration`: Phát hiện văn bản bài nộp có sự thay đổi đột biến giữa các phiên bản nháp mà không khai báo Prompt tương ứng.
* **Gắn cờ thủ công (Manual Flagging)**: Giảng viên hoặc Chủ nhiệm bộ môn có thể tự gắn cờ bài nộp sau khi chấm bài thủ công kèm lý do chi tiết.
* **Xử lý cờ (Resolve Flag)**: Giảng viên xem xét giải trình của sinh viên, cập nhật trạng thái cờ (`isResolved = true`) hoặc đưa ra quyết định xử phạt (giảm điểm, yêu cầu viết lại).

---

## 4. Yêu cầu Giao diện Đối ngoại (External Interface Requirements)

### 4.1. Giao diện Người dùng (UI)
* **Giao diện So sánh Văn bản (Side-by-side Diff View)**: Giảng viên có giao diện hiển thị 2 phiên bản bài viết song song. Các đoạn văn thay đổi, thêm mới được highlight bằng màu xanh (Additions) và các đoạn xóa đi bằng màu đỏ (Deletions). Các đoạn văn liên kết với AI sẽ hiển thị biểu tượng AI, nhấp vào sẽ mở Popup chứa Prompt/Response và Reflection tương ứng của đoạn văn đó.
* **Dashboard Trực quan**: Hiển thị các bảng đồ thị bằng Chart.js/Recharts thể hiện mức độ tương tác AI của sinh viên.
* **Trình soạn thảo văn bản học thuật (Rich Text Editor)**: Hỗ trợ sinh viên soạn bài trực tiếp trên hệ thống, cho phép bôi đen đoạn văn để liên kết trực tiếp với một Prompt trong AI Audit Log.

### 4.2. Giao diện Phần mềm (Software Interfaces)
* **MongoDB/Mongoose Connection**: Sử dụng kết nối bảo mật để đọc/ghi dữ liệu vào database.
* **Object Storage S3/MinIO API**: Sử dụng SDK để thực hiện upload, download và tạo link tải tạm thời (Presigned URL) cho file bài làm của sinh viên.
* **Google OAuth2 API**: Kết nối lấy thông tin User phục vụ đăng nhập bằng Google.

---

## 5. Các Yêu cầu Phi Chức năng (Non-functional Requirements)

### 5.1. Hiệu năng (Performance)
* **Thuật toán Text Diffing**: Xử lý so sánh hai phiên bản tài liệu (độ dài dưới 10,000 từ) trong thời gian dưới 1 giây.
* **Thời gian phản hồi API (Response Time)**: Tối đa 500ms cho các API CRUD thông thường.

### 5.2. Bảo mật (Security)
* **Mã hóa mật khẩu**: Mật khẩu người dùng phải được băm bằng thuật toán bảo mật (bcrypt/argon2) trước khi lưu DB.
* **Bảo mật API**: Bảo mật toàn bộ các API (ngoại trừ auth) bằng JWT Access Token truyền qua header `Authorization: Bearer <token>`.
* **Cơ chế chống giả mạo JWT**: Sử dụng chữ ký mạnh và khóa bí mật (`JWT_SECRET_ACCESS_TOKEN`) lưu ở biến môi trường.

### 5.3. Độ tin cậy & Tính khả dụng (Reliability & Usability)
* **Tính sẵn sàng (Availability)**: Hệ thống hoạt động liên tục 24/7, thời gian downtime phục vụ bảo trì dưới 1% mỗi tháng.
* **Tính tương thích**: Hiển thị tốt trên cả màn hình máy tính (PC/Laptop) và thiết bị di động (Responsive Web Design).
