# API Specification Gap & Frontend React Integration Report
*Last updated: July 2026*

This report audits all 21 backend API modules implemented in `src/routes/` against the Frontend React components (`src/pages/`, `src/components/`).

---

## 1. Executive Summary & Classification

### 🟢 Group 1: Implemented in API & Connected in React UI (Fully Functional)
1. **Authentication (`/auth/*`)**: Login, Register, JWT Token management & RBAC role routing.
2. **Real-time Chat (`/chat/*`)**: Messaging, room management, user search (`MessagesPage.tsx`, `chat.service.ts`).

### 🟡 Group 2: Connected in React UI but Lacking Mock DB Data (Needs Seeding)
1. **User Management & Admin Portal (`/users/*`, `/admin/*`)**: React UI pages (`AdminClasses.tsx`, `AdminSubjects.tsx`, etc.) call `axiosClient` correctly, but the **database is empty**, causing empty tables.
2. **Assignment & Submission Flow (`/assignments/*`, `/submissions/*`, `/ai-interactions/*`)**: Lecturer creation and Student 5-step AI declaration submission exist, but need real seeded submissions for grading workflows.
3. **AI Evaluation & Review (`/submissions/:id/ai-evaluation`, `/submissions/:id/review`)**: `LecturerGradingDetail.tsx` currently uses hardcoded student information; needs to be connected to `GET /submissions/:id` and `GET /ai-evaluation`.

### 🔴 Group 3: Fully Implemented Backend APIs with NO Connected React UI
1. **Final Results & Student Transcript (`/final-results/*`, `/grades/*`)**:
   - **Backend**: 9 endpoints for class final results calculation (`POST /classes/:classId/final-results/calculate`), rankings, classifications, and student transcript (`GET /students/me/results`).
   - **Frontend**: `GradebookPage.tsx` and `StudentTranscriptPage.tsx` are 100% static mock data not calling `axiosClient`.
2. **Academic Reports & Plagiarism / AI Usage Analytics (`/report/*`)**:
   - **Backend**: Rich analytics endpoints for AI Usage (`/ai-usage`), Suspicious Cases (`/suspicious-cases`), and Excel/PDF Exports (`/export`).
   - **Frontend**: `SubjectHeadDashboardPage.tsx` and `LecturerReportsPage.tsx` are static. There is **NO React page** (`SuspiciousCasesPage.tsx`) built for `/reports/suspicious-cases`.
3. **Online Tests & Assessment (`/tests/*`, `/test-attempts/*`)**:
   - **Backend**: 11 endpoints for creating quizzes, test analytics, overriding scores, student test attempts, and cheating detection.
   - **Frontend**: `LecturerCreateTestPage.tsx`, `LecturerTestAnalyticsPage.tsx`, `StudentTakeTestPage.tsx`, and `StudentTestResultPage.tsx` are 100% static mock UI without any API calls.
4. **Notifications, Announcements & Email Delivery Logs (`/notifications/*`, `/email-logs/*`)**:
   - **Backend**: CRUD for user notifications, unread badge count, broadcast announcements (`POST /notifications/announcements`), and Admin Email Logs (`GET /email-logs`, `POST /email-logs/:id/retry`).
   - **Frontend**: **ZERO React UI components exist**. Missing topbar notification bell dropdown, announcement creation modal, and Admin email log viewer.

---

## 2. Action Plan & Next Steps
1. **Phase 1: Full Ecosystem Data Seeding**: Create a comprehensive seeding script (`seed_full_ecosystem.ts`) populating Admins, Subject Heads, Lecturers, Students, Semesters, Subjects, Classes, Assignments, Submissions with 5-phase AI declarations, Tests, and Notifications.
2. **Phase 2: Grading & Final Results Integration**: Connect `LecturerGradingDetail.tsx`, `GradebookPage.tsx`, and `StudentTranscriptPage.tsx` to real backend endpoints.
3. **Phase 3: AI Analytics & Suspicious Cases UI**: Build `SuspiciousCasesPage.tsx` and connect reports dashboards.
4. **Phase 4: Online Assessment & Notifications UI**: Connect quiz pages and build topbar notification components.
