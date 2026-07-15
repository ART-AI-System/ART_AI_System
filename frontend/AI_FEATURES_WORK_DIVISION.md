# TÀI LIỆU PHÂN CHIA CÔNG VIỆC & HƯỚNG DẪN FEED CHO AI (AI FEATURES WORK DIVISION)
**Dự án:** `ART_AI_System` (Assessment & Academic Integrity System with AI)  
**Công nghệ:** Frontend (React 18, Vite, TypeScript, TailwindCSS) | Backend (Node.js Express, MongoDB, TypeScript)  
**Mục tiêu:** Tích hợp Trợ lý AI thật sự (`Real AI Integration`) sử dụng **Google Gemini API / OpenAI API** để hỗ trợ Giảng viên trong 2 trụ cột: **Chấm điểm tự động (`Grading`)** và **Kiểm soát trung thực - Vấn đáp (`Integrity & Viva Defense`)**.

---

## 🏗️ I. TỔNG QUAN PHÂN CHIA KHỐI LƯỢNG CÔNG VIỆC (WORK DIVISION)

Khối lượng công việc được chia độc lập và song song cho **2 Lập trình viên (Người A & Người B)**, dùng chung một Client cấu hình LLM (`src/utils/aiClient.ts`).

| Hạng mục | Người A (Trợ lý Chấm điểm - AI Grading) | Người B (Kiểm soát Trung thực & Vấn đáp - AI Audit & Viva) |
| :--- | :--- | :--- |
| **Trọng tâm** | Phân tích bài nộp theo Rubric, đề xuất điểm và tự động viết lời phê (`Suggested Feedback`). | Đối soát khai báo AI (`AiInteractions`) với Code thực tế, chấm điểm trung thực (`Consistency Score`) và tự động tạo 3 câu hỏi phỏng vấn bảo vệ (`Viva Questions`). |
| **Backend Service** | `backend/src/services/aiGrading.service.ts` | `backend/src/services/aiAudit.service.ts` |
| **Backend Controller** | `POST /api/submissions/:submissionId/ai-grade-suggestion` | `POST /api/submissions/:submissionId/ai-audit-viva` |
| **Frontend Component** | Nút **"🚀 Phân tích AI theo Rubric"** & Bảng điểm đề xuất bên trong `EvaluationPanel.tsx`. | Tab **"🛡️ AI Audit & Vấn đáp"** bên trong `EvaluationPanel.tsx` hoặc `AIDrawer.tsx`. |
| **Đầu ra LLM (JSON)** | Điểm đề xuất, đánh giá từng tiêu chí, lời nhận xét tổng quát. | Điểm khớp khai báo (%), danh sách Cờ đỏ (`Red Flags`), 3 câu hỏi vấn đáp xoáy vào code khó. |

---

## 🔧 II. CẤU HÌNH DÙNG CHUNG (CẢ 2 NGƯỜI CÙNG BIẾT & THỐNG NHẤT)

### 1. Biến môi trường (`backend/.env`)
Thêm vào file `.env` của backend:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSy... (Điền API key của Google Studio hoặc OpenAI vào đây)
GEMINI_MODEL=gemini-1.5-pro-latest
```

### 2. Helper gọi LLM chuẩn hóa (`backend/src/utils/aiClient.ts`)
*Cả 2 người sẽ gọi qua helper này để nhận kết quả JSON chuẩn:*
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

export async function callLLMWithJSON<T>(systemInstruction: string, userPrompt: string): Promise<T> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-pro-latest',
    systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  })

  const result = await model.generateContent(userPrompt)
  const responseText = result.response.text()
  return JSON.parse(responseText) as T
}
```

---

## 🟢 III. TÀI LIỆU & PROMPT FEED CHO AI - DÀNH CHO NGƯỜI A (AI GRADING ASSISTANT)

> 💡 **CÁCH SỬ DỤNG CHO NGƯỜI A:**  
> Bạn copy toàn bộ phần **[PROMPT ĐỂ NGƯỜI A FEED VÀO AI CỦA HỌ]** bên dưới, dán vào AI Assistant (Cursor / Gemini / ChatGPT / Claude) của bạn để AI tự hiểu context code base và viết code cho bạn ngay lập tức!

### [PROMPT ĐỂ NGƯỜI A FEED VÀO AI CỦA HỌ]
```markdown
Tôi đang phát triển tính năng "Trợ lý AI Chấm điểm theo Rubric" cho hệ thống ART_AI_System (Node.js Express + MongoDB + TypeScript ở Backend, React + Vite + TailwindCSS ở Frontend).
Nhiệm vụ của tôi là làm Backend API `POST /api/submissions/:submissionId/ai-grade-suggestion` và Frontend tích hợp vào `EvaluationPanel.tsx`.

1. **Context dữ liệu hiện có trong Database:**
   - `Submission`: Chứa `_id`, `studentId`, `fileName`, `fileStorageKey`.
   - `GradeItem` (hoặc `Assignment`): Chứa `title`, `maxScore`, và cấu trúc `rubric` (hoặc mô tả yêu cầu bài tập).
   - Hàm lấy cây code / nội dung code: Có thể dùng `submissionsService.getSubmissionFileContent(submissionId, user, { path: 'src/index.js' })` hoặc đọc nội dung các file code chính (`.js`, `.ts`, `.py`) trong bài nộp zip.

2. **Yêu cầu cụ thể cho Backend (`backend/src/services/aiGrading.service.ts` & Controller):**
   - Tạo hàm `analyzeSubmissionAndSuggestGrade(submissionId: string, user: User)`:
     - Lấy thông tin bài nộp (`Submission`) + tiêu chí/mô tả bài tập (`GradeItem`).
     - Lấy nội dung 3-5 file code quan trọng nhất trong bài nộp (ví dụ: `src/index.js`, `README.md`, `src/utils.js`).
     - Gọi `callLLMWithJSON<AIGradingSuggestion>` (từ `src/utils/aiClient.ts`) với prompt dưới đây.
   - Trả về JSON structure:
     ```typescript
     export interface AIGradingSuggestion {
       summary: string; // Tóm tắt project trong 3 dòng
       suggestedScore: number; // Điểm đề xuất (hệ 10 hoặc hệ maxScore)
       rubricBreakdown: {
         criteriaName: string; // Tên tiêu chí (ví dụ: Clean Code, Logic, Structure)
         score: number; // Điểm tiêu chí
         maxScore: number;
         comment: string; // Lời phê cho tiêu chí này
       }[];
       suggestedFeedback: string; // Lời phê tổng quát để giảng viên dán thẳng vào ô Feedback
     }
     ```

3. **System Instruction & Prompt cho Gemini 1.5 Pro (Bên trong Service):**
   - **System Instruction:** "Bạn là một Giảng viên Chuyên gia Khoa học Máy tính & Kỹ thuật Phần mềm (Software Engineering Expert Professor). Nhiệm vụ của bạn là đánh giá công tâm, chính xác bài tập lập trình của sinh viên dựa trên Rubric và Source Code thực tế. Luôn trả về dữ liệu chuẩn JSON định dạng đã yêu cầu, nhận xét khích lệ nhưng chỉ rõ lỗi kỹ thuật."
   - **User Prompt:** "Đánh giá bài nộp sau đây:\n- Tên bài tập/Rubric: ${gradeItem.title}\n- Mô tả tiêu chí: ${gradeItem.description}\n- Nội dung Source Code sinh viên:\n${codeSnippets}\n\nHãy phân tích và trả về JSON theo đúng định dạng AIGradingSuggestion."

4. **Yêu cầu Frontend (`src/components/lecturer/EvaluationPanel.tsx`):**
   - Thêm nút **"✨ AI Phân tích & Đề xuất điểm"** ngay phía trên ô `Score / Feedback`.
   - Khi bấm bấm, hiển thị `Loader` (đang phân tích...). Khi API trả về, hiển thị một khung nhỏ (Card) có màu tím/xanh ngọc chèn ngay trên form chấm:
     - Hiển thị `Điểm đề xuất: X/10` + Nút **"Áp dụng điểm này"**.
     - Hiển thị danh sách `rubricBreakdown` (accordion hoặc list nhỏ).
     - Nút **"Dán lời phê vào form"** để tự động copy `suggestedFeedback` vào state textarea của form chấm.

Hãy viết cho tôi code hoàn chỉnh của `aiGrading.service.ts`, `submissions.controller.ts` (phần thêm route mới), và cách cập nhật `EvaluationPanel.tsx`.
```

---

## 🔵 IV. TÀI LIỆU & PROMPT FEED CHO AI - DÀNH CHO NGƯỜI B (AI INTEGRITY & VIVA DEFENSE)

> 💡 **CÁCH SỬ DỤNG CHO NGƯỜI B:**  
> Bạn copy toàn bộ phần **[PROMPT ĐỂ NGƯỜI B FEED VÀO AI CỦA HỌ]** bên dưới, dán vào AI Assistant (Cursor / Gemini / ChatGPT / Claude) của bạn để AI tự hiểu context code base và viết code cho bạn ngay lập tức!

### [PROMPT ĐỂ NGƯỜI B FEED VÀO AI CỦA HỌ]
```markdown
Tôi đang phát triển tính năng "Kiểm soát Trung thực & Sinh câu hỏi Vấn đáp tự động (AI Audit & Viva Defense Generator)" cho hệ thống ART_AI_System (Node.js Express + MongoDB + TypeScript ở Backend, React + Vite + TailwindCSS ở Frontend).
Nhiệm vụ của tôi là làm Backend API `POST /api/submissions/:submissionId/ai-audit-viva` và Frontend hiển thị trên tab "🛡️ AI Audit" trong màn hình chấm điểm của giảng viên (`EvaluationPanel.tsx` hoặc `AIDrawer.tsx`).

1. **Context dữ liệu hiện có trong Database:**
   - `Submission`: Chứa `_id`, `studentId`, `fileName`.
   - `AiInteraction` (`backend/src/models/schemas/aiInteractions.schema.ts`): Đây là danh sách các khai báo sử dụng AI của sinh viên cho bài nộp này, mỗi record chứa:
     - `aiTool`: ('chatgpt' | 'gemini' | 'claude' | 'copilot')
     - `usagePurpose`: ('decomposition' | 'pattern_recognition' | 'abstraction' | 'algorithmic_thinking')
     - `promptContent`: Lời nhắc sinh viên hỏi AI
     - `aiResponseSummary`: Tóm tắt câu trả lời của AI
     - `reflectionText`: Sinh viên tự reflection
   - `GradeItem` / `Assignment`: Chứa `minAiInteractions` và `maxAiInteractions` cho phép.

2. **Yêu cầu cụ thể cho Backend (`backend/src/services/aiAudit.service.ts` & Controller):**
   - Tạo hàm `generateAuditAndVivaQuestions(submissionId: string, user: User)`:
     - Lấy danh sách khai báo AI (`AiInteractions`) từ collection `aiInteractions` của bài nộp này.
     - Lấy nội dung các file code chính trong bài nộp zip (tương tự dịch vụ lấy content code).
     - Gọi `callLLMWithJSON<AIAuditAndVivaResponse>` với prompt đối soát dưới đây.
   - Trả về JSON structure:
     ```typescript
     export interface AIAuditAndVivaResponse {
       consistencyScore: number; // Điểm khớp giữa lời khai báo và code thực tế (0 - 100%)
       status: 'GREEN' | 'YELLOW' | 'RED'; // GREEN >= 80%, YELLOW >= 50%, RED < 50%
       summaryAnalysis: string; // Đánh giá độ trung thực trong 2-3 câu
       redFlags: string[]; // Danh sách các dấu hiệu khả nghi (ví dụ: "Sử dụng pattern Singleton phức tạp nhưng không khai báo trong AiInteractions")
       vivaQuestions: {
         questionNumber: number;
         questionText: string; // Câu hỏi vấn đáp xoáy vào code khó hoặc code AI
         targetFilePath: string; // File liên quan (ví dụ: src/utils.js)
         targetLineOrFunction: string; // Tên hàm hoặc dòng liên quan
         expectedAnswer: string; // Đáp án mong đợi & gợi ý cho giảng viên khi phỏng vấn
         purpose: 'CHECK_UNDERSTANDING' | 'AUDIT_AI_CODE' | 'LOGIC_VERIFICATION';
       }[]; // Luôn trả về đúng 3 câu hỏi
     }
     ```

3. **System Instruction & Prompt cho Gemini 1.5 Pro (Bên trong Service):**
   - **System Instruction:** "Bạn là một Giảng viên Kỹ thuật Phần mềm kiêm Thanh tra Học vụ cực kỳ sắc bén (Academic Integrity Sentinel & Software Architecture Examiner). Nhiệm vụ của bạn là đối soát lời khai báo sử dụng AI của sinh viên với Source Code thực tế họ nộp. Hãy tìm ra những đoạn code có văn phong LLM phức tạp nhưng không được khai báo, đồng thời tạo ra đúng 3 câu hỏi Vấn đáp bảo vệ (Viva Defense Questions) xoáy sâu vào logic code khó nhất để giảng viên phỏng vấn sinh viên."
   - **User Prompt:** "Hãy đối soát trung thực và tạo câu hỏi vấn đáp cho bài nộp này:\n- Danh sách khai báo AI của sinh viên (AiInteractions):\n${JSON.stringify(aiInteractions, null, 2)}\n- Nội dung Source Code sinh viên:\n${codeSnippets}\n\nHãy phân tích độ khớp và trả về JSON chuẩn theo đúng cấu trúc AIAuditAndVivaResponse."

4. **Yêu cầu Frontend (`src/components/lecturer/EvaluationPanel.tsx` hoặc `AIDrawer.tsx`):**
   - Tạo một Tab hoặc Panel nút **"🛡️ AI Audit & Vấn đáp Bảo vệ"**.
   - Khi bấm, gọi API `POST /api/submissions/:id/ai-audit-viva`.
   - Hiển thị kết quả:
     - Thẻ Huy hiệu trạng thái: `GREEN (Trung thực cao - consistencyScore%)`, `YELLOW (Cần lưu ý)`, hoặc `RED (🔴 Cờ đỏ gian lận/Thiếu khai báo nghiêm trọng)`.
     - Liệt kê các `redFlags` (nếu có).
     - Khung **"3 Câu hỏi Vấn đáp Bảo vệ (Viva Defense Cards)"**: Mỗi câu hỏi có nút xem `expectedAnswer` (giúp giảng viên biết câu trả lời đúng khi hỏi sinh viên).

Hãy viết cho tôi code hoàn chỉnh của `aiAudit.service.ts`, `submissions.controller.ts` (phần thêm route mới), và cách cập nhật giao diện `EvaluationPanel.tsx` / `AIDrawer.tsx` cho tính năng này.
```

---

## 🚀 V. QUY TRÌNH HỢP NhẤT (MERGE & INTEGRATION CHECKLIST)

Khi cả 2 người hoàn tất phần việc của mình:
1. **Kiểm tra xung đột Route:**
   Cả 2 người sẽ thêm route vào `backend/src/routes/submissions.routes.ts`:
   - Người A thêm: `POST /submissions/:submissionId/ai-grade-suggestion`
   - Người B thêm: `POST /submissions/:submissionId/ai-audit-viva`
2. **Kiểm tra UI `EvaluationPanel.tsx`:**
   - Người A đặt Card "Đề xuất điểm AI" phía trên ô nhập điểm.
   - Người B đặt Tab / Nút "AI Audit & Vấn đáp" kế bên ô xem file / chấm điểm.
3. **Chạy thử nghiệp vụ:**
   - Upload 1 file zip bài nộp mẫu có khai báo AI (`AiInteractions`).
   - Bấm cả 2 nút để trải nghiệm sức mạnh của AI hỗ trợ toàn diện từ **Chấm điểm (`Grading`)** đến **Phỏng vấn bảo vệ (`Defense`)**.
