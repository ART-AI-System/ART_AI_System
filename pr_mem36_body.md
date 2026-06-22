## Overview
This Pull Request completes the Quizzes/Tests backend APIs and Admin/Login UI modifications assigned to **Mem 36**. 

### 💡 What's New & Different from Original Specs

After reviewing the original UI mockups vs API specifications, several additions were made to the backend to fully support the Frontend without dropping any UI features:

**1. Tests & Quizzes APIs (Backend):**
- **Test Schema & Test Attempts Schema**: Added robust schemas handling multiple choice/checkbox questions, hidden correct answers for students, scoring, and cheat tracking.
- **Auto-grading mechanism**: API `/submit` now automatically computes scores based on Lecturer's correct answers.
- **Manual Score Override (`PATCH /api/test-attempts/:attemptId/override-score`)**: Added per user request to allow lecturers to override auto-graded scores.
- **Export to Gradebook (`POST /api/tests/:testId/export-grades`)**: Added per user request. This API allows pushing a batch of graded tests directly to the system's core Gradebook.
- **Anti-Cheat Endpoint (`POST /api/tests/:testId/cheat`)**: Added per user request. The backend now exposes an endpoint to track tab-switching or focus loss during tests. (Frontend needs to integrate `visibilitychange` or `Fullscreen API` to call this).

**2. UI Mockup Revisions (Frontend):**
- **Login Flow (`login.html`)**: Transformed into a 2-step flow (Campus Selection -> Role Selection) with **4 distinct Roles** (Student, Lecturer, Head Subject, Admin). Added a "Backdoor" Admin login trigger by clicking the FPT logo.
- **Admin Dashboard (`admin_dashboard.html`)**: Completely redesigned to match the new analytical requirements, featuring statistics cards, a bar chart, a donut chart, and student/notice lists.
- **Admin Sidebar**: Removed duplicate menus, standardized the green theme (`#16A34A`), transformed `Teachers` into an `Employees` dropdown, and added proper Settings/Messages/Feedback/Logout items.
- **Admin Communication Pages (`admin_messages.html`, `admin_feedback.html`)**: Created entirely new HTML mockups to support internal system messaging and user feedback reports.

### Code Changes
- Updated `database.service.ts` to index new collections.
- Created `tests.schema.ts`, `testAttempts.schema.ts`.
- Created `tests.service.ts`, `tests.controllers.ts`, `tests.routes.ts` & injected to `index.ts`.
- Modified `generate_admin_mockups.py` and regenerated all admin HTML files.
- Modified `login.html` logic.
