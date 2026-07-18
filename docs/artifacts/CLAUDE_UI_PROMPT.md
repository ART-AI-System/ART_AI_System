# BỘ PROMPT THIẾT KẾ UI BẰNG CLAUDE CODE (Hoặc v0, Cursor)

> [!TIP]
> Thay vì dùng Relume để vẽ khung (Wireframe), bạn có thể dùng các công cụ AI lập trình (như Claude Artifacts, v0.dev, hoặc chính tôi) để **sinh thẳng ra Code Giao diện (React + Tailwind CSS)** chạy được luôn. Điểm mấu chốt là phải miêu tả cấu trúc Sidebar cực kỳ rõ ràng.

Dưới đây là 2 đoạn Prompt (dành cho 2 màn hình quan trọng nhất). Bạn chỉ cần Copy từng đoạn và thả vào Claude để AI tự động code ra giao diện.

---

## Màn hình 1: Student Dashboard (Có Sidebar dọc)

**Copy Prompt dưới đây thả vào Claude:**

```text
Act as an expert Frontend Developer and UI/UX Designer. Please build a modern Student Dashboard Web Application for a Learning Management System named "ART-AI". 
Use React, Tailwind CSS, and Lucide React icons.

CRITICAL LAYOUT REQUIREMENTS:
- Do NOT use a top-only navigation. You MUST build an "Application Shell" layout.
- Left Sidebar: Fixed, width 260px, dark blue gradient background (from #0072BC to #122A5E). Contains navigation links: Dashboard, Courses, Submissions, AI Analytics, Settings.
- Top Header: Sticky, contains a global search bar, a semester dropdown, notification bell, and user avatar.
- Main Content Area: Placed to the right of the sidebar with a light grey background (#F8F9FA).

MAIN CONTENT DESIGN:
- Title: "Your Courses - Summer 2026"
- A CSS Grid displaying 3 to 4 Course Cards.
- Each Course Card must be white, rounded-xl, with a soft shadow. Inside the card:
  + Course Code (e.g., SWD392)
  + Course Name (e.g., Software Architecture)
  + Teacher Avatar and Name
  + A progress bar using an Orange gradient (from #F26F21 to #F79C65).
  + A button "Go to Class" with outline style.

Aesthetics: Use glassmorphism where appropriate, clean typography (Inter font), and ensure it looks like a modern SaaS dashboard.
```

---

## Màn hình 2: AI Declaration & Submission (Màn hình Nộp bài)

Sau khi Claude làm xong màn 1, bạn mở một cửa sổ mới và nhập Prompt cho Màn hình số 2:

```text
Act as an expert Frontend Developer and UI/UX Designer. Please build the "Submission & AI Declaration" page for the ART-AI Learning Management System.
Use React, Tailwind CSS, and Lucide React icons.

LAYOUT:
- Keep the same Application Shell layout: Fixed Left Sidebar (Deep Blue gradient) and Top Header.
- Main Content Area will use a Split-Pane view (2 columns).

LEFT COLUMN (File Upload Zone):
- A large, white card with a dashed border for drag-and-drop file upload.
- An icon indicating upload (cloud or folder).
- Text: "Drag and drop your assignment file here or click to browse (Max 10MB, PDF/ZIP)".

RIGHT COLUMN (AI Interaction Form):
- A white card titled "AI Usage Declaration".
- A dynamic form with the following fields:
  1. Dropdown for "AI Tool Used" (ChatGPT, Gemini, Claude, Other).
  2. Textarea for "Your Prompt" (What you asked the AI).
  3. Textarea for "AI Response Summary".
  4. Textarea for "Your Reflection" (Critical thinking on the AI's output).
- A button "+ Add another AI Interaction" with an outline style.
- A final solid submit button at the bottom: "Submit Assignment & Declaration". Use a vibrant Orange gradient (#F26F21 to #F79C65) for this primary button.

Aesthetics: Soft drop shadows, rounded corners (rounded-2xl), clean spacing, professional and academic look.
```

---

### 💡 Lời khuyên thêm:
Nếu bạn muốn **chính tôi** (trợ lý AI của bạn) viết luôn các đoạn code React + Tailwind này thành các file `.html` hoặc `.tsx` và thả vào thư mục dự án của bạn để bạn mở lên xem trực tiếp trên máy, hãy báo cho tôi biết nhé! Tôi có thể code luôn giao diện này thay vì bạn phải mang sang Claude.
