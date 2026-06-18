# BỘ PROMPT RELUME AI CHI TIẾT CHO DỰ ÁN ART-AI

> [!TIP]
> Relume AI hoạt động tốt nhất khi bạn nhập một **Master Prompt** (Prompt tổng) thật dài và chi tiết ngay từ bước đầu tiên khởi tạo Site Builder. Nó sẽ tự động chia nhỏ ý của bạn ra thành từng trang (Pages) và từng phần (Sections).

Dưới đây là bộ Prompt Tiếng Anh chuẩn mực đã được tinh chỉnh để ép Relume vẽ ra giao diện của một **Web Application (Phần mềm)** thay vì một trang Landing Page bán hàng thông thường.

---

## 1. MASTER PROMPT (Copy Paste vào ô đầu tiên của Relume)

Hãy copy toàn bộ khối văn bản tiếng Anh dưới đây và dán vào ô nhập liệu khi bạn bấm `Generate Site` trên Relume:

```text
Create a comprehensive sitemap and wireframes for a Learning Management System (LMS) Web Application named "ART-AI". The application focuses on continuous learning assessment, academic transparency, and AI usage declaration for university students. 

CRITICAL RULE: This is a Dashboard Web App, NOT a marketing website. Do not include pricing, testimonials, or marketing sections. Every page must use dashboard-style layouts, preferably with a left sidebar navigation and a top header containing notifications and a user profile avatar.

Please generate the following specific pages and sections:

1. Authentication Portal (Login/Register)
- Split layout design. Left side features an educational graphic. Right side features a clean form for students to input "Student Code" and "Password" with a primary "Sign In" button and a "Forgot Password" link.

2. Student Dashboard (Home)
- Header section welcoming the student with a dropdown to select the current "Semester".
- A Stats/Metrics section showing upcoming deadlines and average score.
- A Grid List section displaying horizontal "Course Cards". Each card must show the Subject Code, Subject Name, Teacher Name, and a progress bar.

3. Class Detail & Session View
- A page layout representing a specific class.
- A vertical list or accordion layout displaying weekly learning slots (e.g., Slot 1, Slot 2).
- Inside each slot, show list items for reading materials (PDF/Doc icons) and Assignment links.

4. Assignment & Submission Upload
- A page detailing an assignment's instructions, deadline, and max score.
- A split-layout form section for submission. The left side must be a large drag-and-drop file upload zone (dashed borders).

5. AI Declaration Form
- A dynamic form section placed immediately after the file upload. 
- Must contain input fields and dropdowns for "AI Tool Used" (ChatGPT, Gemini), "Prompt Textarea", "AI Response Summary", and "Student Reflection". Add a button to "Add another AI interaction".

6. Gradebook & Evaluation
- A Data Table section listing all assignments, the academic score achieved, and teacher's feedback.
- A dedicated Stats widget displaying the "AI Transparency Score" with a visual indicator (e.g., circular progress or badge) and AI flags.

7. Realtime Chat Application
- A standard chat interface layout. Left column shows a list of chat rooms (classmates, lecturers). Right column is the chat window with a message input area at the bottom.
```

---

## 2. XỬ LÝ SITEMAP (Bước Chỉnh Sửa Khung)

Sau khi dán Master Prompt và bấm Generate, Relume sẽ ra một cái cây (Sitemap). 
Lúc này, Relume có thể sẽ tự động nhét thêm một số trang thừa. Bạn hãy bấm vào cấu trúc cây và **XÓA (Delete)** các trang/khối sau nếu thấy:
- `Testimonials`
- `Pricing`
- `Call to Action (CTA) / Newsletter`
- `Footer` (Web App Dashboard thường không có footer khổng lồ như web bán hàng).

---

## 3. PROMPT ĐỂ THAY THẾ COMPONENT (Chế độ Wireframe)

Khi chuyển sang chế độ đen trắng (Wireframe), đôi khi AI của Relume chọn sai mẫu (Ví dụ: Trang danh sách lớp học nó lại lấy mẫu bài viết Blog). 

Lúc này, bạn hãy bấm vào cái khối bị sai đó, chọn nút **Replace** (Góc trên bên phải của khối), chọn tab **Search** và gõ các từ khóa tiếng Anh sau để tìm ra mẫu giao diện chuẩn nhất:

- **Tìm khung Dashboard có Sidebar:** Gõ `Dashboard Sidebar` hoặc `Application Shell`.
- **Tìm các thẻ Môn học (Course Card):** Gõ `Card Grid`, `Stats Grid` hoặc `List Layout`.
- **Tìm danh sách Session (Slot 1, Slot 2):** Gõ `Accordion` hoặc `Timeline`.
- **Tìm khu vực Nộp bài (Upload File):** Gõ `Contact Form`, sau đó ra Figma bạn sẽ sửa cái ô nhập Text thành ô nét đứt (Drag & Drop) sau.
- **Tìm trang Xem điểm (Gradebook):** Gõ `Data Table` hoặc `Table`.
- **Tìm giao diện Chat:** Relume ít mẫu chat, bạn hãy gõ `List` cho cột trái và `Content` cho cột phải.

---

## 4. BƯỚC CUỐI: XUẤT RA FIGMA VÀ ÁP MÀU FPT

Sau khi có khung Wireframe hoàn chỉnh trên Relume, bạn bấm `Copy to Figma`. Khi sang Figma, bạn hãy dựa vào **UI DESIGN SPEC** mà chúng ta đã trao đổi ở bước trước để:
1. Đổ màu cam Gradient `#F26F21` vào các nút Button quan trọng.
2. Bo tròn góc các khối (Border Radius: 12px hoặc 16px).
3. Đổ bóng (Drop Shadow: Y=4, Blur=12, Opacity=5%) cho các thẻ Card môn học.

Chúc bạn thiết kế ra một bản Mockup xuất sắc để chốt luồng với PM và team Backend!
