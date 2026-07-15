# 🤖 ART-AI System: AI Assistant Operating Rules & Guidelines

This document defines the mandatory operating rules and architectural guidelines for any AI assistant (Antigravity, Cursor, Claude, Gemini, Windsurf, etc.) working on the `FE_ART_AI_System` codebase.

---

## 🛑 1. MANDATORY OPERATING RULES (CRITICAL)

### 1.1. Push ONLY Upon Explicit User Approval (*"chỉ được push sau khi tôi nói push code lên main"*)
- **DO NOT PUSH** code to git or remote branches automatically upon completing a task or build verification.
- Always stop after committing locally or finishing code modifications, and inform the user that changes are ready for local verification (`npm run dev`).
- **ONLY execute `git push`** when the user explicitly commands (e.g., *"push code lên main"*, *"push đi"*, *"đẩy lên git"*).
- When explicitly instructed to push, ensure changes are pushed to both `fe HEAD:main` and the working feature branch (`fe feat/fe-admin-ui`) to maintain synchronization.

### 1.2. Autonomous Execution (*"tiến hành không cần sự đồng ý về thứ tự công việc"*)
- Once a feature or task is requested, proceed independently through the necessary implementation steps, refactoring, and build verification without interrupting the user for minor step-by-step confirmations.

### 1.3. Layout & UI Stability (*"Đừng bấm extra ra bị vỡ layout, cứ scroll thôi"*)
- Never introduce UI changes that expand container widths/heights unpredictably or cause screen overflow/layout breakage.
- Always utilize clean, bounded scrollable containers (`overflow-y-auto`, `custom-scrollbar`, `max-h-[...]`) for lists, tables, and dropdowns.

---

## 🏗️ 2. ARCHITECTURAL & TECHNICAL CONVENTIONS

### 2.1. Environment Configuration
- **Local Workspace**: `e:\FPT\7_SU26\WDP\ART-AI`
- **REST API Base URL**: Configured globally via `axiosClient` pointing to `http://localhost:3000/api` (or `import.meta.env.VITE_API_BASE_URL`).
- **Real-Time WebSocket**: Configured globally via `socketService` ([src/services/chat.socket.ts](src/services/chat.socket.ts)) and shared via the `useSocket` hook ([src/hooks/useSocket.ts](src/hooks/useSocket.ts)).
  - **Rule**: DO NOT instantiate new `io()` WebSocket client connections in individual components. Always subscribe via `useSocket()` to prevent duplicate connections and auth token conflicts.

### 2.2. Verification & Build Standard
- Before concluding any coding turn, run `npm run build` using the terminal tool to verify that 0 TypeScript or Vite compilation errors exist across the codebase.
- Maintain legacy compatibility in shared contexts (e.g., `AuthContext`, `Guards`) when extending interfaces.

---

## 📋 3. SUMMARY OF CORE SYSTEM MODULES

- **Admin Setup Flow**: [AdminLayout.tsx](src/layouts/AdminLayout.tsx), [AdminClassesPage.tsx](src/pages/admin/AdminClassesPage.tsx), `AdminSemesters.tsx`, `AdminSubjects.tsx`.
- **Subject Head Analytics**: [SuspiciousCasesPage.tsx](src/pages/subjectHead/SuspiciousCasesPage.tsx) (>80% AI similarity audit), [SubjectHeadDashboardPage.tsx](src/pages/subjectHead/SubjectHeadDashboardPage.tsx).
- **Lecturer Assessments & Grading**: [LecturerCreateTestPage.tsx](src/pages/lecturer/LecturerCreateTestPage.tsx), [CodeReviewer.tsx](src/components/lecturer/CodeReviewer.tsx) (`jszip` in-browser submission archive reviewer).
- **Student Exam & Submission**: [StudentTakeTestPage.tsx](src/pages/student/StudentTakeTestPage.tsx), [AiDeclarationForm.tsx](src/components/student/AiDeclarationForm.tsx), [StudentTestResultPage.tsx](src/pages/student/StudentTestResultPage.tsx).
- **Global Notification & Announcement System**: [NotificationDropdown.tsx](src/components/common/NotificationDropdown.tsx) (Real-time WebSocket listeners with LIVE/OFFLINE badge indicator).
