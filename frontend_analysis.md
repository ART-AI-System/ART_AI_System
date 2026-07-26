# Frontend Analysis Report

## 1. Existing Screens
The frontend application is structured by roles (`admin`, `lecturer`, `student`, `subjectHead`) with specific pages for each:

**Student Screens**:
- `StudentDashboardPage.tsx`
- `StudentClassesPage.tsx`
- `StudentClassDetailPage.tsx`
- `MySubmissionsPage.tsx`
- `SubmissionDetailPage.tsx`
- `SubmissionGradePage.tsx`
- `StudentNewsPage.tsx`, `StudentMessagesPage.tsx`, etc.

**Lecturer Screens**:
- `LecturerDashboardPage.tsx`
- `LecturerClassesPage.tsx`
- `LecturerClassDetailPage.tsx`
- `LecturerGradingSubjectsPage.tsx`
- `LecturerGradingAssignmentsPage.tsx`
- `LecturerGradingListPage.tsx`
- `LecturerGradingDetailPage.tsx`

**Subject Head Screens**:
- `SubjectHeadDashboardPage.tsx`

**Admin Screens**:
- `AdminDashboardPage.tsx`
- `UsersPage.tsx`
- `AdminClassesPage.tsx`, `AdminSubjectsPage.tsx`, etc.

## 2. Existing APIs
The frontend currently implements the following services (`src/services/`):
- `chat.service.ts`
- `chat.socket.ts`
- `user.service.ts`

Note: Much of the data is currently driven by mocks, such as `classes.mock.ts`, `dashboard.mock.ts`, `submissions.mock.ts`, `auth.mock.ts`, and `mockDatabase.ts`. Actual HTTP calls for submissions and grading appear to be missing or mocked.

## 3. Existing Submission Components
Submissions are mostly handled directly within the page components:
- **Student**: `MySubmissionsPage.tsx`, `SubmissionDetailPage.tsx`, `SubmissionGradePage.tsx`.
- **Lecturer**: `LecturerGradingAssignmentsPage.tsx`, `LecturerGradingListPage.tsx`, `LecturerGradingDetailPage.tsx`.
There is currently no dedicated generic "Submission Upload Component" in `src/components/common/`, meaning file upload logic is likely embedded in the pages or not fully built yet.

## 4. Reusable Components
Located in `src/components/common/`:
- `ErrorState.tsx`
- `Heatmap.tsx`
- `LecturerSubjectCard.tsx`
- `PageHeader.tsx`
- `StatCard.tsx`
- `StatusBadge.tsx`
- `SubjectCard.tsx`
Layout components in `src/components/layout/` handle the structural UI (e.g., `Header.tsx`, `AdminSidebar.tsx`, `LecturerSidebar.tsx`, `StudentSidebar.tsx`).
